locals {
  service   = "tea"
  db_secret = data.aws_secretsmanager_secret.db_secret.arn
}
