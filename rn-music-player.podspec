require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "rn-music-player"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "10.0" }
  s.source       = { :git => "https://github.com/mtroskot/rn-music-player.git", :tag => "#{s.version}" }


  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.swift_version = "4.2"

  s.dependency "React-Core"
end
