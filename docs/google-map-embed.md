# Google Map Embed Block

## Overview

The Google Map Embed block allows you to easily embed Google Maps into your WordPress content. This block provides a simple interface for adding maps with customizable display options.

## Features

- Easy embedding of Google Maps via embed code or direct URL
- Live preview in the editor
- Adjustable map dimensions (height and width)
- Customizable zoom level
- Toggle map controls visibility
- Toggle fullscreen capability
- Styling options (border radius and box shadow)
- Responsive design for mobile devices

## How to Use

### Adding the Block

1. In the WordPress editor, click the "+" button to add a new block
2. Search for "Google Map Embed" or find it in the "Murdeni Blocks" category
3. Select the block to add it to your content

### Configuring the Block

#### Basic Setup

1. Once added, you'll see a placeholder with instructions
2. You can either:
   - Paste a Google Maps embed code directly in the placeholder textarea
   - Click "Preview Map" to display the map
   - Or use the sidebar controls for more detailed configuration

#### Getting a Google Maps Embed Code

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your desired location
3. Click the "Share" button
4. Select the "Embed a map" tab
5. Copy the provided HTML code
6. Paste the code into the block's embed code field

### Block Settings

The block settings are available in the sidebar when the block is selected:

#### Map Settings

- **Google Maps Embed Code**: Paste the embed code from Google Maps
- **Map URL**: Automatically extracted from embed code, but can be manually edited
- **Update Preview**: Click to refresh the map preview with current settings
- **Open Google Maps**: Direct link to Google Maps website

#### Display Settings

- **Height**: Adjust the height of the map (200-800px)
- **Width**: Adjust the width of the map as a percentage of container (50-100%)
- **Zoom Level**: Set the map zoom level (1-20)
- **Show Map Controls**: Toggle visibility of map navigation controls
- **Allow Fullscreen**: Enable or disable fullscreen button on the map

#### Style Settings

- **Border Radius**: Add rounded corners to the map (0-30px)
- **Box Shadow**: Add a subtle shadow effect to the map

## Tips and Best Practices

- For best performance, set an appropriate map height based on your content layout
- On mobile devices, the map height automatically adjusts to 300px for better viewing
- Use the zoom level control to focus on the specific area you want to highlight
- Consider disabling map controls for a cleaner appearance when embedding small maps
- Add border radius and box shadow for a more polished look that matches your site design

## Troubleshooting

- **Map not displaying**: Ensure the embed code or URL is correct and contains a valid Google Maps URL
- **Preview not updating**: Click the "Update Preview" button after making changes
- **Embed code not recognized**: Make sure you're copying the full iframe code from Google Maps
- **Map appears too small**: Adjust the height and width settings in the sidebar

## Technical Notes

- The block uses iframe embedding, which is the recommended method by Google
- All map interactions are handled by Google Maps API
- The block is fully responsive and will adapt to different screen sizes
- Custom styling is applied to the container, not the map itself
