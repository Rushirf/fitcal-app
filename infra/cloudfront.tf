resource "aws_cloudfront_distribution" "fitcal-cloudfront-distribution" {
  aliases = var.cloudfront.aliases
  enabled = var.cloudfront.enabled
  default_root_object = var.cloudfront.default_root_object

  origin {
    domain_name = aws_s3_bucket.fitcal-s3-bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.fitcal-cloudfront-origin-access-control.id
    origin_id = var.cloudfront.origin_access_control.s3_origin_id
  }

  restrictions {
    geo_restriction {
      locations = var.cloudfront.geo_restrictions.locations
      restriction_type = var.cloudfront.geo_restrictions.restriction_type
    }
  }

  default_cache_behavior {
    allowed_methods = var.cloudfront.default_cache_behavior.allowed_methods
    cache_policy_id = var.cloudfront.default_cache_behavior.cache_policy_id
    cached_methods = var.cloudfront.default_cache_behavior.cached_methods
    target_origin_id = var.cloudfront.default_cache_behavior.target_origin_id
    viewer_protocol_policy = var.cloudfront.default_cache_behavior.viewer_protocol_policy
  }

  viewer_certificate {
    acm_certificate_arn = var.cloudfront.viewer_certificate.acm_certificate_arn
    ssl_support_method = var.cloudfront.viewer_certificate.ssl_support_method
  }

}


resource "aws_cloudfront_origin_access_control" "fitcal-cloudfront-origin-access-control" {
  name                              = var.cloudfront.origin_access_control.name
  origin_access_control_origin_type = var.cloudfront.origin_access_control.origin_access_control_origin_type
  signing_behavior                  = var.cloudfront.origin_access_control.signing_behavior
  signing_protocol                  = var.cloudfront.origin_access_control.signing_protocol
}