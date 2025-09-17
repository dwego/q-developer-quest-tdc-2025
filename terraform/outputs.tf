output "website_url" {
  description = "URL do website S3"
  value       = "http://${aws_s3_bucket_website_configuration.game_website.website_endpoint}"
}

output "cloudfront_url" {
  description = "URL do CloudFront"
  value       = "https://${aws_cloudfront_distribution.game_distribution.domain_name}"
}

output "s3_bucket_name" {
  description = "Nome do bucket S3"
  value       = aws_s3_bucket.game_bucket.id
}