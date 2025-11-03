resource "aws_s3_bucket" "fitcal-s3-bucket" {
  bucket = var.s3.bucket_name
  force_destroy = var.s3.force_destroy
}


resource "aws_s3_bucket_versioning" "fitcal-s3-bucket-versioning" {
  bucket = aws_s3_bucket.fitcal-s3-bucket.bucket
  versioning_configuration {
    status = var.s3.versioning
  }
}


resource "aws_s3_bucket_public_access_block" "fitcal_pab" {
  bucket = aws_s3_bucket.fitcal-s3-bucket.bucket
  block_public_acls = var.s3.pab.block_public_acls
  block_public_policy = var.s3.pab.block_public_policy
  ignore_public_acls = var.s3.pab.ignore_public_acls
  restrict_public_buckets = var.s3.pab.restrict_public_buckets
}

resource "aws_s3_bucket_website_configuration" "fitcal-static-website-configuration" {
  bucket = aws_s3_bucket.fitcal-s3-bucket.bucket

  index_document {
    suffix = var.s3.index_document_suffix
  }

  error_document {
    key = var.s3.error_document_key
  }
}


resource "aws_s3_bucket_policy" "allow_cf_oac" {
  bucket = aws_s3_bucket.fitcal-s3-bucket.bucket

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipal"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.fitcal-s3-bucket.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.fitcal-cloudfront-distribution.arn
          }
        }
      }
    ]
  })
}




resource "aws_s3_bucket_cors_configuration" "fitcal-s3-cors-configuration" {
  bucket = aws_s3_bucket.fitcal-s3-bucket.bucket
  cors_rule {
    allowed_headers = var.s3.cors.allowed_headers
    allowed_methods = var.s3.cors.allowed_methods
    allowed_origins = [join("",["https://","${aws_cloudfront_distribution.fitcal-cloudfront-distribution.domain_name}"])]
    expose_headers = var.s3.cors.expose_headers
  }
}