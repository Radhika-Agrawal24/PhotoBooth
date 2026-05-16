AI Photobooth

An interactive AI-powered photobooth web application built using React, MediaPipe, and the HTML5 Canvas API.

The application allows users to capture photos through their webcam, apply real-time filters, remove backgrounds using AI segmentation, customize photo strips, and download the final output as a PNG image.

Features
Real-time webcam capture
AI-powered background removal
Multiple live filters
Brightness, contrast, blur, hue, and saturation controls
Custom background selection
Background opacity adjustment
Capture up to 3 photos
Automatic photo strip generation
Custom text and caption support
Draggable text positioning
Font styling and color customization
Upload custom strip backgrounds
Download final photo strip as PNG
Tech Stack
React
JavaScript
MediaPipe Selfie Segmentation
HTML5 Canvas API
html2canvas
CSS
How It Works
Webcam Integration

The application accesses the user’s webcam using the browser Media Devices API.

Real-Time Filters

Users can apply live filters and manually adjust visual properties like brightness, contrast, blur, hue, and saturation.

AI Background Removal

MediaPipe Selfie Segmentation is used to separate the person from the background in real time.

Canvas Rendering

The Canvas API is used for:

applying filters
rendering segmentation masks
compositing backgrounds
generating final images
Final Strip Generation

Captured photos are combined into a customizable photo strip where users can:

add text
drag text position
change font styles
upload backgrounds
export the final design
Learning Outcomes

Through this project, I learned:

React Hooks
Real-time rendering workflows
Browser media APIs
Canvas compositing
AI segmentation integration
State management
Interactive UI development
Modular project architecture
Future Improvements
Add stickers and frames
Add GIF/video export
Mobile responsiveness improvements
Cloud image storage
Social sharing support
Author

Radhika Agrawal
