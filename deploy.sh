#!/bin/bash

# Script de deploy para AWS
set -e

echo "🚀 Deploy do Quem Disse? Game na AWS"

# Verificar se AWS CLI está configurado
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI não configurado. Execute: aws configure"
    exit 1
fi

# Opção de deploy
echo "Escolha o método de deploy:"
echo "1) Terraform"
echo "2) CloudFormation"
read -p "Digite sua escolha (1 ou 2): " choice

case $choice in
    1)
        echo "📦 Deploying com Terraform..."
        cd terraform
        terraform init
        terraform plan
        terraform apply -auto-approve
        echo "✅ Deploy concluído! URLs:"
        terraform output
        ;;
    2)
        echo "📦 Deploying com CloudFormation..."
        STACK_NAME="quem-disse-game-stack"
        aws cloudformation deploy \
            --template-file cloudformation/template.yaml \
            --stack-name $STACK_NAME \
            --capabilities CAPABILITY_IAM
        
        echo "📤 Fazendo upload dos arquivos..."
        BUCKET_NAME=$(aws cloudformation describe-stacks \
            --stack-name $STACK_NAME \
            --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
            --output text)
        
        aws s3 cp index.html s3://$BUCKET_NAME/
        aws s3 cp style.css s3://$BUCKET_NAME/
        aws s3 cp script.js s3://$BUCKET_NAME/
        
        echo "✅ Deploy concluído! URLs:"
        aws cloudformation describe-stacks \
            --stack-name $STACK_NAME \
            --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
            --output table
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo "🎉 Jogo disponível na AWS!"