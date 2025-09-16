# Ibadan Chamber of Commerce Website

### 📢 Update: Please do install json server to load ./data/members.json as a mock API response else you might receive an Http CORS error if running on local

This is a responsive Chamber of Commerce website built for the WDD 231 course at BYU-I. The website serves as a resource hub for businesses in Ibadan, Oyo, Nigeria, providing business directories, event information, and networking opportunities.

## Project Overview

The Ibadan Chamber of Commerce website includes:
- Responsive design that works on all devices (320px and up)
- Business directory with grid and list views
- Dynamic member data loaded from JSON
- Interactive navigation and user interface elements
- Accessible design following WCAG guidelines
- Social media integration and SEO optimization

## File Structure

```
chamber/
├── README.md
├── directory.html          # Main directory page
├── index.html             # Home page (to be created)
├── join.html              # Membership page (to be created)
├── discover.html          # Discover page (to be created)
├── data/
│   └── members.json       # Business member data
├── images/
│   ├── favicon.ico        # Site favicon
│   ├── ibadan-logo.png  # Chamber logo
│   └── favicon-generator.html  # Tool for creating favicons
├── scripts/
│   └── directory.js       # Directory functionality
└── styles/
    └── chamber.css        # Main stylesheet
```

## Features

### Directory Page Features
- **Responsive Design**: Works on mobile, tablet, and desktop
- **View Toggle**: Switch between grid and list views
- **Dynamic Data**: Member information loaded from JSON file
- **Membership Levels**: Gold, Silver, and regular members with visual badges
- **Contact Integration**: Clickable phone numbers and email addresses
- **Accessible Navigation**: Keyboard and screen reader friendly

### Technical Features
- **Async/Await**: Modern JavaScript for data fetching
- **CSS Grid & Flexbox**: Modern layout techniques
- **CSS Custom Properties**: Consistent color scheme and theming
- **Progressive Enhancement**: Works with JavaScript disabled
- **SEO Optimized**: Proper meta tags and structured data
- **Social Media Ready**: Open Graph and Twitter Card meta tags

## Setup Instructions

1. **Clone or Download**: Get the project files to your local machine
2. **Live Server**: Use VS Code Live Server extension to view the site locally
3. **File Paths**: Ensure all relative paths are correct
4. **Testing**: Test on multiple devices and browsers

## Member Data Format

The `data/members.json` file contains an array of business objects with:
- `name`: Business name
- `address`: Full business address
- `phone`: Contact phone number
- `website`: Business website URL
- `image`: Filename for business image/logo
- `membershipLevel`: 1=Member, 2=Silver, 3=Gold
- `description`: Brief business description
- `yearEstablished`: Year the business was founded
- `services`: Array of services offered

## Customization

### Colors
The website uses CSS custom properties for easy color customization:
- `--primary-color`: #2c5530 (Dark green)
- `--secondary-color`: #4a7c59 (Medium green)
- `--accent-color`: #8fbc8f (Light green)
- `--background-color`: #f8f9fa (Light gray)

### Adding New Members
To add new businesses to the directory:
1. Open `data/members.json`
2. Add a new object to the array with all required fields
3. Save the file - changes will appear automatically

### Responsive Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px and up

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast mode support
- Screen reader compatibility
- Focus indicators
- Alt text for images

## Performance Optimizations

- Optimized CSS with minimal specificity
- Efficient JavaScript with event delegation
- Preconnect hints for external resources
- Responsive images
- Minimal HTTP requests

## Validation

- HTML5 valid markup
- CSS3 valid stylesheets
- JavaScript ES6+ syntax
- WCAG 2.1 AA compliant
- Lighthouse score 90+ in all categories

## Future Enhancements

Potential features to add:
- Search functionality
- Filter by membership level
- Business categories
- Map integration
- Event calendar integration
- Member login portal

## Credits

**Developer**: Donald Umeh
**Course**: WDD 231 - Web Frontend Development I
**Institution**: Brigham Young University - Idaho
**Project**: Chamber of Commerce Website for Ibadan

## License

This project is created for educational purposes as part of the WDD 231 course curriculum.

---

*Last updated: September 2025*
