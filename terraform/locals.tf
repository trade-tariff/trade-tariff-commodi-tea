locals {
  service          = "tea"
  init_command     = ["/bin/sh", "-c", "npx sequelize-cli db:migrate"]
  cognito_pool_url = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${data.aws_cognito_user_pool.this.id}"
}
