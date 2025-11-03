terraform {
  backend "s3" {
    bucket = "rushi-terraform-backend-bucket"
    key = "fitcalapp/terraform.tfstate"
    region = "us-east-1"
  }
}