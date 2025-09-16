# Chamber of Commerce Website Testing Checklist

This document provides a comprehensive testing checklist for the Ibadan Chamber of Commerce website to ensure all requirements are met and the site functions properly across different devices and browsers.

## Pre-Testing Setup

### Required Files Checklist
- [ ] `directory.html` - Main directory page
- [ ] `index.html` - Home page
- [ ] `data/members.json` - Business member data (10+ entries)
- [ ] `styles/chamber.css` - Main stylesheet
- [ ] `scripts/directory.js` - Directory functionality
- [ ] `images/ibadan-logo.svg` - Chamber logo
- [ ] `images/favicon.ico` - Site favicon
- [ ] `README.md` - Project documentation

### Local Development Setup
- [ ] VS Code with Live Server extension installed
- [ ] All files saved with proper encoding (UTF-8)
- [ ] File paths use forward slashes and relative paths
- [ ] No absolute file system paths used

## HTML Validation Testing

### Document Structure
- [ ] Valid HTML5 DOCTYPE declaration
- [ ] Proper `<html lang="en">` attribute
- [ ] Complete `<head>` section with required meta tags
- [ ] Semantic HTML structure (header, nav, main, footer)
- [ ] All images have alt attributes
- [ ] Proper heading hierarchy (h1, h2, h3, etc.)

### Meta Tags Validation
- [ ] Title tag present and descriptive (under 60 characters)
- [ ] Meta description present (under 160 characters)
- [ ] Meta author tag with your full name
- [ ] Viewport meta tag for responsive design
- [ ] Favicon link properly referenced

### Facebook Open Graph Tags
- [ ] `og:title` - Page title
- [ ] `og:description` - Page description
- [ ] `og:image` - Image URL (absolute path)
- [ ] `og:url` - Page URL (absolute path)
- [ ] `og:type` - Set to "website"
- [ ] `og:site_name` - Chamber name

### Social Media Meta Testing
- [ ] Test with Facebook Sharing Debugger tool
- [ ] Enter your GitHub Pages URL
- [ ] Click "Debug" button
- [ ] Verify all Open Graph properties display correctly
- [ ] Check that image loads properly
- [ ] No errors or warnings shown

## CSS Validation Testing

### Responsive Design Testing
- [ ] Test at 320px width (smallest mobile)
- [ ] Test at 768px width (tablet)
- [ ] Test at 1024px width (desktop)
- [ ] No horizontal scrolling at any breakpoint
- [ ] Content remains readable at all sizes
- [ ] Images scale properly without distortion

### Navigation Testing
- [ ] Desktop navigation displays horizontally
- [ ] Mobile navigation shows hamburger menu
- [ ] Hamburger menu toggles properly on click
- [ ] Menu closes when clicking outside
- [ ] Menu closes when window resizes to desktop
- [ ] All navigation links work correctly
- [ ] Active page highlighted in navigation

### Layout Testing
- [ ] Header stays consistent across pages
- [ ] Footer stays consistent across pages
- [ ] Main content area properly centered
- [ ] Maximum width constraint applied (1200px)
- [ ] Proper spacing and padding throughout
- [ ] Color scheme consistent throughout site

## JavaScript Functionality Testing

### Data Loading
- [ ] Members data loads from JSON file successfully
- [ ] Console shows no JavaScript errors
- [ ] Loading spinner displays while fetching data
- [ ] Error message displays if JSON fails to load
- [ ] All 10+ members display correctly

### View Toggle Functionality
- [ ] Grid view button works and shows grid layout
- [ ] List view button works and shows list layout
- [ ] Active button state changes correctly
- [ ] View preference persists during session
- [ ] Both views display same member information

### Member Data Display
- [ ] Business names display correctly
- [ ] Addresses show complete information
- [ ] Phone numbers are clickable (tel: links)
- [ ] Website URLs are clickable and open in new tab
- [ ] Membership levels display with correct badges
- [ ] Services list shows for each member
- [ ] Establishment year displays correctly

### Footer Dynamic Content
- [ ] Copyright year updates automatically
- [ ] Last modified date generates correctly
- [ ] Date format is readable and accurate

## Accessibility Testing

### Keyboard Navigation
- [ ] All interactive elements focusable with Tab key
- [ ] Focus indicators clearly visible
- [ ] Tab order is logical and intuitive
- [ ] Enter/Space keys activate buttons
- [ ] Escape key closes mobile menu

### Screen Reader Testing
- [ ] All images have meaningful alt text
- [ ] Form elements have proper labels
- [ ] ARIA labels present where needed
- [ ] Semantic HTML used throughout
- [ ] Page structure makes sense without CSS

### Color and Contrast
- [ ] Text meets WCAG contrast requirements
- [ ] Links clearly distinguishable from text
- [ ] Button states clearly visible
- [ ] Color not used as only indicator

## Performance Testing

### Page Load Testing
- [ ] Initial page loads in under 3 seconds
- [ ] JSON data loads quickly
- [ ] Images load without blocking page render
- [ ] No unused CSS or JavaScript files

### Network Testing
- [ ] Site works on slow internet connections
- [ ] Graceful degradation when JavaScript disabled
- [ ] Images have appropriate file sizes
- [ ] External links load correctly

## Browser Compatibility Testing

### Required Browsers
- [ ] Chrome (latest version)
- [ ] Firefox (latest version)
- [ ] Safari (latest version)
- [ ] Edge (latest version)

### Mobile Browser Testing
- [ ] Chrome Mobile
- [ ] Safari Mobile (iOS)
- [ ] Samsung Internet (Android)

## SEO and Analytics Testing

### Search Engine Optimization
- [ ] Page titles are unique and descriptive
- [ ] Meta descriptions are compelling
- [ ] Heading structure is logical
- [ ] Internal links work correctly
- [ ] External links have rel="noopener"

### Structured Data
- [ ] JSON-LD schema markup present
- [ ] Organization schema includes all required fields
- [ ] Address information structured correctly
- [ ] Contact information properly formatted

## Assignment Requirements Verification

### File Structure Requirements
- [ ] Chamber folder created in wdd231 directory
- [ ] All assets organized in proper subfolders
- [ ] JSON file stored in data subfolder
- [ ] No CSS framework used (Bootstrap, Tailwind(even though I'd love to use this), etc.)

### Content Requirements
- [ ] Minimum 7 businesses in JSON (you have 10)
- [ ] Each business has all required fields
- [ ] Membership levels properly assigned (1, 2, 3)
- [ ] Footer includes full name and WDD 231
- [ ] Contact information in footer

### Technical Requirements
- [ ] Fetch API used with async/await
- [ ] No jQuery or other JavaScript libraries
- [ ] CSS Grid and/or Flexbox used for layout
- [ ] Custom CSS properties (CSS variables) used
- [ ] Responsive design without horizontal scrolling

## Lighthouse Testing

### Performance Audit
- [ ] Performance score 90+ (mobile)
- [ ] Performance score 90+ (desktop)
- [ ] First Contentful Paint under 2 seconds
- [ ] Largest Contentful Paint under 4 seconds

### Accessibility Audit
- [ ] Accessibility score 90+
- [ ] All accessibility issues resolved
- [ ] Color contrast ratios pass
- [ ] Form elements properly labeled

### Best Practices Audit
- [ ] Best Practices score 90+
- [ ] HTTPS used (GitHub Pages)
- [ ] No console errors
- [ ] Images have proper dimensions

### SEO Audit
- [ ] SEO score 90+
- [ ] Meta description present
- [ ] Page title appropriate length
- [ ] Links have descriptive text

## Final Deployment Testing

### GitHub Pages Testing
- [ ] Repository properly configured for GitHub Pages
- [ ] All files uploaded to GitHub
- [ ] Site accessible via GitHub Pages URL
- [ ] All relative paths work correctly
- [ ] Images and assets load properly

### URL Testing
- [ ] Directory page URL follows required format:
  `https://your-username.github.io/wdd231/chamber/directory.html`
- [ ] All internal links work correctly
- [ ] External links open in new tabs
- [ ] Social media links work (even if placeholder)

### Cross-Device Testing
- [ ] iPhone/iOS mobile view
- [ ] Android mobile view
- [ ] iPad/tablet view
- [ ] Desktop/laptop view
- [ ] Large desktop view (1440px+)

## Error Handling Testing

### Network Error Testing
- [ ] Test with JSON file temporarily renamed
- [ ] Verify error message displays properly
- [ ] Test with slow/interrupted connection
- [ ] Ensure graceful fallback behavior

### JavaScript Error Testing
- [ ] Test with JavaScript disabled
- [ ] Verify basic functionality still works
- [ ] Test with browser console open for errors
- [ ] Fix any runtime JavaScript errors

## Pre-Submission Checklist

### Code Quality
- [ ] HTML validates with W3C validator
- [ ] CSS validates with W3C CSS validator
- [ ] JavaScript has no syntax errors
- [ ] Code is properly indented and formatted
- [ ] Comments added where helpful

### Documentation
- [ ] README.md file complete and accurate
- [ ] All placeholder URLs updated with your GitHub username
- [ ] File paths verified as working
- [ ] Installation/setup instructions clear

### Assignment Submission
- [ ] GitHub repository public and Pages enabled
- [ ] Correct URL format for submission
- [ ] All files committed and pushed to GitHub
- [ ] Site loads correctly from submitted URL

---

## Testing Notes

**Date Tested:** 9/16/25
**Tester:** Donald umeh

**Final Status:** ⭐ Ready for Submission

---

*Last Updated: September 2025*
