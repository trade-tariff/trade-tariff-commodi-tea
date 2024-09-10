data "aws_vpc" "vpc" {
  tags = { Name = "trade-tariff-${var.environment}-vpc" }
}

data "aws_subnets" "private" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.vpc.id]
  }

  tags = {
    Name = "*private*"
  }
}

data "aws_lb_target_group" "this" {
  name = "tea"
}

data "aws_security_group" "this" {
  name = "trade-tariff-ecs-security-group-${var.environment}"
}

data "aws_kms_key" "secretsmanager_key" {
  key_id = "alias/secretsmanager-key"
}

data "aws_ssm_parameter" "ecr_url" {
  name = "/${var.environment}/TEA_ECR_URL"
}

data "aws_secretsmanager_secret" "database_connection_string" {
  name = "postgrescommoditea-connection-string"
}

data "aws_secretsmanager_secret" "cookie_signing_secret" {
  name = "commodi-tea-cookie-signing-secret"
}

data "aws_cognito_user_pools" "this" {
  name = "commodi-tea-user-pool"
}

data "aws_region" "current" {}

data "aws_secretsmanager_secret" "cognito_open_id_client_id" {
  name = "tea-cognito-client-id"
}

data "aws_secretsmanager_secret_version" "cognito_open_id_client_id_version" {
  secret_id = data.aws_secretsmanager_secret.cognito_open_id_client_id.id
}

data "aws_secretsmanager_secret" "cognito_open_id_client_secret" {
  name = "tea-cognito-client-secret"
}

data "aws_secretsmanager_secret_version" "cognito_open_id_client_secret_version" {
  secret_id = data.aws_secretsmanager_secret.cognito_open_id_client_secret.id
}

data "aws_secretsmanager_secret" "cognito_open_id_secret" {
  name = "tea-cognito-secret"
}

data "aws_secretsmanager_secret_version" "cognito_open_id_secret_version" {
  secret_id = data.aws_secretsmanager_secret.cognito_open_id_secret.id
}
