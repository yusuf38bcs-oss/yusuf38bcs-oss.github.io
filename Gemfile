source "https://rubygems.org"

# GitHub Pages compatible build environment
gem "github-pages", group: :jekyll_plugins
gem "jekyll-remote-theme", group: :jekyll_plugins
gem "jekyll-include-cache", group: :jekyll_plugins

# Ruby 3.4 compatibility
gem "csv"
gem "fiddle"

# Windows and JRuby dependencies
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1", platforms: [:mingw, :x64_mingw, :mswin]

# Lock http_parser.rb gem to v0.6.x on JRuby builds
platforms :jruby do
  gem "http_parser.rb", "~> 0.6.0"
end

# Webrick for local server (Ruby 3+)
gem "webrick", "~> 1.9"
gem "minimal-mistakes-jekyll"
