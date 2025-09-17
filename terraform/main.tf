terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 Bucket para hospedagem estática
resource "aws_s3_bucket" "game_bucket" {
  bucket = "${var.project_name}-${random_string.suffix.result}"
}

resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

resource "aws_s3_bucket_website_configuration" "game_website" {
  bucket = aws_s3_bucket.game_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "game_bucket_pab" {
  bucket = aws_s3_bucket.game_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "game_bucket_policy" {
  bucket = aws_s3_bucket.game_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.game_bucket.arn}/*"
      },
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.game_bucket_pab]
}

# Upload dos arquivos
resource "aws_s3_object" "index" {
  bucket       = aws_s3_bucket.game_bucket.id
  key          = "index.html"
  source       = "../index.html"
  content_type = "text/html"
  etag         = filemd5("../index.html")
}

resource "aws_s3_object" "style" {
  bucket       = aws_s3_bucket.game_bucket.id
  key          = "style.css"
  source       = "../style.css"
  content_type = "text/css"
  etag         = filemd5("../style.css")
}

resource "aws_s3_object" "script" {
  bucket       = aws_s3_bucket.game_bucket.id
  key          = "script.js"
  source       = "../script.js"
  content_type = "application/javascript"
  etag         = filemd5("../script.js")
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "game_distribution" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.game_website.website_endpoint
    origin_id   = "S3-${aws_s3_bucket.game_bucket.id}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.game_bucket.id}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = var.project_name
  }
}