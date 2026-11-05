// OCR whole images with Apple's Vision framework, for the design check (scripts/design.ts check): what text a
// screenshot or a Figma crop actually shows, line by line, with its box. Swift because Vision is only reachable from
// Swift/Objective-C (as scripts/ocr-tiles.swift).
// Usage: swift scripts/ocr-images.swift <job.json>
//   job.json: ["<image path>", …]; writes to stdout { "<image path>": { w, h, lines: [{ text, x, y, w, h, conf }] } }
//   with the image's size and each line's box in its pixels, top-left origin. An image that cannot be read maps to null.
// No language correction: UI copy is compared character by character, so a typo must stay a typo.
import Foundation
import Vision
import ImageIO

struct Line: Codable { let text: String; let x: Int; let y: Int; let w: Int; let h: Int; let conf: Float }
struct Image: Codable { let w: Int; let h: Int; let lines: [Line] }

let paths = try JSONDecoder().decode([String].self, from: Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1])))
var out: [String: Image?] = [:]
for p in paths {
  guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: p) as CFURL, nil), let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { out[p] = .some(nil); continue }
  let req = VNRecognizeTextRequest()
  req.recognitionLevel = .accurate
  req.usesLanguageCorrection = false
  req.recognitionLanguages = ["en-US", "zh-Hant", "ja-JP", "zh-Hans"]
  req.minimumTextHeight = 0.006
  try VNImageRequestHandler(cgImage: img, options: [:]).perform([req])
  let W = Double(img.width), H = Double(img.height)
  out[p] = Image(w: img.width, h: img.height, lines: (req.results ?? []).compactMap { o in
    guard let c = o.topCandidates(1).first else { return nil }
    let b = o.boundingBox  // normalized, bottom-left origin
    return Line(text: c.string, x: Int(b.minX * W), y: Int((1 - b.maxY) * H), w: Int(b.width * W), h: Int(b.height * H), conf: c.confidence)
  })
}
let enc = JSONEncoder(); enc.outputFormatting = [.withoutEscapingSlashes]
FileHandle.standardOutput.write(try enc.encode(out))
