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
  keyId = "alias/secretsmanager-key"
}

data "aws_ssm_parameter" "ecr_url" {
  name = "/${var.environment}/TEA_ECR_URL"
}

data "aws_secretsmanager_secret" "database_connection_string" {
  name = "postgrescommoditea-connection-string"
}
