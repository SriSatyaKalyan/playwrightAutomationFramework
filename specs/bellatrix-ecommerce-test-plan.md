# Bellatrix Solutions E-commerce Test Plan

## Application Overview

Comprehensive test plan for the Bellatrix Solutions e-commerce demo website (https://demos.bellatrix.solutions/). This test plan covers functional testing of e-commerce operations, contact forms, user authentication, content management, performance testing, accessibility compliance, and data cleanup scenarios. The website sells space-related products (rockets) and includes features like product catalog browsing, shopping cart management, checkout with payment processing, contact forms, blog functionality, and user account management.

## Test Scenarios

### 1. E-commerce Core Functionality

**Seed:** `tests/seed.spec.ts`

#### 1.1. Product Catalog Browsing

**File:** `tests/ecommerce/product-catalog.spec.ts`

**Steps:**
  1. Navigate to the home page (https://demos.bellatrix.solutions/)
  2. Verify all products are displayed with correct information
  3. Verify product images are loaded correctly
  4. Verify product names, prices, and sale badges are visible
  5. Check that 'Add to cart' buttons are present for available products
  6. Verify 'Read more' buttons for products that require them

**Expected Results:**
  - Home page loads successfully within 3 seconds
  - All 5 products (Falcon 9, Proton Rocket, Proton-M, Saturn V, Falcon Heavy) are visible
  - Product images display without broken links
  - Sale badges appear on discounted items
  - Pricing information shows both original and discounted prices where applicable
  - Interactive elements are properly functional

#### 1.2. Product Details View

**File:** `tests/ecommerce/product-details.spec.ts`

**Steps:**
  1. Navigate to a specific product page (e.g., Falcon 9)
  2. Verify product title, description, and pricing details
  3. Check product image gallery functionality
  4. Verify quantity selector is functional
  5. Test product tabs (Description, Additional Information, Reviews)
  6. Verify related products section displays correctly
  7. Check breadcrumb navigation functionality

**Expected Results:**
  - Product page loads with complete product information
  - Image gallery allows navigation between product images
  - Quantity selector accepts valid input (positive numbers)
  - Product tabs switch content correctly when clicked
  - Related products show relevant recommendations
  - Breadcrumbs provide correct navigation path

#### 1.3. Shopping Cart Management

**File:** `tests/ecommerce/shopping-cart.spec.ts`

**Steps:**
  1. Add a product to cart from product page
  2. Verify cart icon updates with correct item count and total
  3. Navigate to cart page
  4. Verify cart displays correct product information
  5. Test quantity modification in cart
  6. Test item removal from cart
  7. Apply a coupon code (if available)
  8. Verify cart totals calculation including VAT

**Expected Results:**
  - Product is successfully added to cart with confirmation
  - Cart counter and total update immediately
  - Cart page shows complete product details and pricing
  - Quantity changes update subtotals correctly
  - Items can be removed from cart
  - Coupon codes are processed appropriately
  - VAT calculation is correct (10€ VAT shown for 50€ subtotal)

#### 1.4. Product Sorting and Filtering

**File:** `tests/ecommerce/sorting-filtering.spec.ts`

**Steps:**
  1. Navigate to the shop page
  2. Test 'Default sorting' option
  3. Test 'Sort by popularity' option
  4. Test 'Sort by average rating' option
  5. Test 'Sort by latest' option
  6. Test 'Sort by price: low to high' option
  7. Test 'Sort by price: high to low' option
  8. Verify product count display accuracy

**Expected Results:**
  - All sorting options function correctly
  - Products are reordered according to selected criteria
  - Product count remains accurate (Showing all 5 results)
  - Page performance remains optimal during sorting
  - No broken layouts or missing products during sort operations

### 2. Checkout and Payment Processing

**Seed:** `tests/seed.spec.ts`

#### 2.1. Guest Checkout Process

**File:** `tests/checkout/guest-checkout.spec.ts`

**Steps:**
  1. Add product to cart and proceed to checkout
  2. Fill in billing details as guest user
  3. Verify billing form validation
  4. Select shipping method if available
  5. Verify order summary displays correct information
  6. Select payment method
  7. Complete payment processing
  8. Verify order confirmation page

**Expected Results:**
  - Checkout page loads with proper form fields
  - Form validation prevents submission with invalid data
  - Order totals match cart calculations
  - Payment processing completes successfully
  - Order confirmation shows transaction details
  - Email confirmation is sent (if configured)

#### 2.2. Payment Method Validation

**File:** `tests/checkout/payment-methods.spec.ts`

**Steps:**
  1. Navigate to checkout with items in cart
  2. Test each available payment method
  3. Verify payment method selection updates UI
  4. Test invalid payment information handling
  5. Test payment processing with valid test data
  6. Verify payment failure handling
  7. Test payment confirmation flow

**Expected Results:**
  - All payment methods are selectable and functional
  - Invalid payment data shows appropriate error messages
  - Valid payment data processes successfully
  - Payment failures are handled gracefully
  - Payment confirmations include transaction reference numbers

#### 2.3. Order Processing Workflow

**File:** `tests/checkout/order-processing.spec.ts`

**Steps:**
  1. Complete a full purchase transaction
  2. Verify order confirmation details
  3. Check order status in account (if logged in)
  4. Verify email notifications
  5. Test order history access
  6. Verify invoice generation (if available)

**Expected Results:**
  - Order is processed and confirmed successfully
  - Correct order details appear in confirmation
  - Order appears in customer account history
  - Email confirmations contain accurate information
  - Order status updates appropriately

### 3. User Authentication and Account Management

**Seed:** `tests/seed.spec.ts`

#### 3.1. User Login Functionality

**File:** `tests/auth/user-login.spec.ts`

**Steps:**
  1. Navigate to My Account page
  2. Verify login form is displayed
  3. Test login with invalid credentials
  4. Test login with valid credentials
  5. Verify 'Remember me' functionality
  6. Test account dashboard access after login
  7. Verify logout functionality

**Expected Results:**
  - Login form displays with username and password fields
  - Invalid credentials show appropriate error message
  - Valid credentials redirect to account dashboard
  - Remember me option maintains session appropriately
  - Dashboard shows account information and options
  - Logout successfully ends user session

#### 3.2. Password Reset Process

**File:** `tests/auth/password-reset.spec.ts`

**Steps:**
  1. Navigate to login page
  2. Click 'Lost your password?' link
  3. Enter email address for password reset
  4. Verify reset email is sent
  5. Follow password reset link (if available)
  6. Set new password
  7. Verify login with new password

**Expected Results:**
  - Password reset link is accessible from login page
  - Valid email addresses trigger reset process
  - Reset email contains valid reset link
  - New password can be set successfully
  - Login works with newly set password

#### 3.3. Account Management Features

**File:** `tests/auth/account-management.spec.ts`

**Steps:**
  1. Login to user account
  2. Navigate to account dashboard
  3. Verify account information display
  4. Test account information editing
  5. Verify order history access
  6. Test address book management
  7. Verify account settings modification

**Expected Results:**
  - Account dashboard loads with user information
  - Account details can be viewed and edited
  - Order history displays previous purchases
  - Address book allows adding/editing addresses
  - Account settings save successfully

### 4. Contact Form and Communications

**Seed:** `tests/seed.spec.ts`

#### 4.1. Contact Form Functionality

**File:** `tests/forms/contact-form.spec.ts`

**Steps:**
  1. Navigate to Contact Form page
  2. Verify all form fields are present and accessible
  3. Test form validation with empty fields
  4. Test form validation with invalid email format
  5. Fill out all required fields with valid data
  6. Select access pass options (Bronze/Silver/Gold)
  7. Choose session attendance options
  8. Select overnight stay option
  9. Complete reCAPTCHA verification
  10. Submit the form

**Expected Results:**
  - Contact form loads with all required fields
  - Form validation prevents submission with missing required fields
  - Email validation works correctly
  - Radio buttons and checkboxes function properly
  - reCAPTCHA loads and can be completed
  - Form submission succeeds with valid data
  - Confirmation message is displayed after submission

#### 4.2. Form Input Validation

**File:** `tests/forms/form-validation.spec.ts`

**Steps:**
  1. Test name field validation (First and Last name)
  2. Test email field with various invalid formats
  3. Test access pass selection requirement
  4. Test session selection requirement
  5. Test overnight stay selection requirement
  6. Test optional comments field
  7. Test newsletter subscription checkbox
  8. Verify error message display for validation failures

**Expected Results:**
  - Name fields accept valid text input
  - Email validation catches common format errors
  - Required selections prevent form submission when empty
  - Optional fields don't block form submission
  - Error messages are clear and helpful
  - Validation occurs both on field blur and form submission

### 5. Content Management and Navigation

**Seed:** `tests/seed.spec.ts`

#### 5.1. Blog Functionality

**File:** `tests/content/blog.spec.ts`

**Steps:**
  1. Navigate to Blog page
  2. Verify blog posts are displayed
  3. Test blog post pagination (if applicable)
  4. Click on individual blog post
  5. Verify blog post content loads correctly
  6. Test blog post navigation (next/previous)
  7. Verify blog search functionality (if available)

**Expected Results:**
  - Blog page loads with list of blog posts
  - Blog posts display title, excerpt, and metadata
  - Pagination works correctly for multiple posts
  - Individual blog posts load complete content
  - Blog post navigation is functional
  - Search returns relevant blog results

#### 5.2. Search Functionality

**File:** `tests/content/search.spec.ts`

**Steps:**
  1. Locate search box in site header
  2. Test search with product names
  3. Test search with partial product names
  4. Test search with non-existent terms
  5. Test empty search submission
  6. Verify search results page layout
  7. Test search result pagination (if applicable)

**Expected Results:**
  - Search box is accessible from all pages
  - Product searches return relevant results
  - Partial matches are included in results
  - No results message displayed for invalid searches
  - Empty searches are handled appropriately
  - Search results are properly formatted and functional

#### 5.3. Promotions and Special Pages

**File:** `tests/content/promotions.spec.ts`

**Steps:**
  1. Navigate to Promotions page (/welcome)
  2. Verify promotional content is displayed
  3. Test any promotional interactive elements
  4. Verify promotional pricing is reflected on products
  5. Test promotional banner functionality
  6. Verify promotional links navigate correctly

**Expected Results:**
  - Promotions page loads with promotional content
  - Interactive elements function as expected
  - Promotional pricing matches product pages
  - Promotional banners are clickable and functional
  - All promotional links navigate to correct destinations

#### 5.4. Navigation and Site Structure

**File:** `tests/content/navigation.spec.ts`

**Steps:**
  1. Test main navigation menu functionality
  2. Verify breadcrumb navigation on all pages
  3. Test mobile navigation (if responsive design)
  4. Verify footer links and information
  5. Test logo link returns to homepage
  6. Verify all internal links work correctly

**Expected Results:**
  - Main navigation menu is accessible and functional
  - Breadcrumbs show correct page hierarchy
  - Mobile navigation works on smaller screens
  - Footer contains working links and copyright information
  - Logo click returns user to homepage
  - No broken internal links exist

### 6. Performance Testing

**Seed:** `tests/seed.spec.ts`

#### 6.1. Page Load Performance

**File:** `tests/performance/page-load.spec.ts`

**Steps:**
  1. Measure homepage load time
  2. Measure product page load time
  3. Measure cart page load time
  4. Measure checkout page load time
  5. Measure contact form page load time
  6. Test performance with different network conditions
  7. Monitor resource loading (images, CSS, JS)

**Expected Results:**
  - Homepage loads within 3 seconds
  - All pages load within 5 seconds on standard connection
  - Images load progressively without blocking page rendering
  - CSS and JavaScript resources load efficiently
  - Page performance remains consistent across different network speeds
  - No timeouts or loading failures occur

#### 6.2. Shopping Cart Performance

**File:** `tests/performance/cart-performance.spec.ts`

**Steps:**
  1. Add multiple items to cart rapidly
  2. Measure cart update response times
  3. Test cart with maximum quantity items
  4. Monitor memory usage during cart operations
  5. Test cart functionality with large product catalogs
  6. Measure checkout initiation time

**Expected Results:**
  - Cart updates complete within 2 seconds
  - Multiple rapid additions don't cause errors
  - Cart handles large quantities without performance degradation
  - Memory usage remains stable during cart operations
  - Checkout initiation is fast and responsive

#### 6.3. Form Processing Performance

**File:** `tests/performance/form-performance.spec.ts`

**Steps:**
  1. Measure contact form submission time
  2. Test form validation response time
  3. Measure checkout form processing time
  4. Test form performance with large data inputs
  5. Monitor server response times for form submissions

**Expected Results:**
  - Form submissions complete within 5 seconds
  - Form validation provides immediate feedback
  - Large form data doesn't cause timeouts
  - Server responds appropriately to all form submissions

### 7. Accessibility Testing

**Seed:** `tests/seed.spec.ts`

#### 7.1. Keyboard Navigation

**File:** `tests/accessibility/keyboard-navigation.spec.ts`

**Steps:**
  1. Navigate entire site using only keyboard (Tab, Enter, Space)
  2. Test form navigation with keyboard only
  3. Verify shopping cart operations via keyboard
  4. Test product selection and quantity changes with keyboard
  5. Verify checkout process is keyboard accessible
  6. Test modal dialogs and popups with keyboard navigation

**Expected Results:**
  - All interactive elements are reachable via keyboard
  - Tab order follows logical page flow
  - Form fields are navigable and editable via keyboard
  - Shopping cart operations work without mouse
  - Checkout process is completely keyboard accessible
  - Focus indicators are visible and clear

#### 7.2. Screen Reader Compatibility

**File:** `tests/accessibility/screen-reader.spec.ts`

**Steps:**
  1. Verify ARIA labels are present on interactive elements
  2. Test heading structure for proper hierarchy
  3. Verify form labels are associated correctly
  4. Test image alt text presence and accuracy
  5. Verify table headers and data cell relationships
  6. Test landmark roles and page structure

**Expected Results:**
  - All interactive elements have appropriate ARIA labels
  - Heading structure follows h1-h6 hierarchy
  - Form labels are properly associated with inputs
  - Images have descriptive alt text
  - Tables have proper header associations
  - Page landmarks are correctly defined

#### 7.3. Visual Accessibility

**File:** `tests/accessibility/visual-accessibility.spec.ts`

**Steps:**
  1. Test color contrast ratios for text and backgrounds
  2. Verify text remains readable when zoomed to 200%
  3. Test site functionality with high contrast mode
  4. Verify focus indicators are visible and sufficient
  5. Test with different color vision simulations
  6. Verify text spacing and readability

**Expected Results:**
  - Color contrast meets WCAG 2.1 AA standards (4.5:1 for normal text)
  - Site remains functional at 200% zoom
  - High contrast mode doesn't break functionality
  - Focus indicators have adequate visibility
  - Content is distinguishable with color vision deficiencies
  - Text spacing allows for comfortable reading

### 8. Data Cleanup and State Management

**Seed:** `tests/seed.spec.ts`

#### 8.1. Shopping Cart Cleanup

**File:** `tests/cleanup/cart-cleanup.spec.ts`

**Steps:**
  1. Add multiple items to shopping cart
  2. Clear cart completely
  3. Verify cart count resets to zero
  4. Verify cart total resets to 0.00€
  5. Test cart cleanup after browser session ends
  6. Verify cart state after logout and re-login
  7. Test cart persistence across page refreshes

**Expected Results:**
  - Cart clears completely when requested
  - Cart counters and totals reset accurately
  - Cart state is properly managed across sessions
  - Login/logout cycles handle cart state appropriately
  - Page refreshes maintain cart state correctly

#### 8.2. Form Data Cleanup

**File:** `tests/cleanup/form-data-cleanup.spec.ts`

**Steps:**
  1. Fill out contact form with test data
  2. Submit form successfully
  3. Return to form and verify fields are reset
  4. Test form state after browser navigation
  5. Verify form data doesn't persist inappropriately
  6. Test checkout form data cleanup after completion

**Expected Results:**
  - Form fields reset after successful submission
  - Navigation doesn't leave orphaned form data
  - Sensitive form data doesn't persist in browser
  - Checkout forms clear after order completion

#### 8.3. Session and Authentication Cleanup

**File:** `tests/cleanup/session-cleanup.spec.ts`

**Steps:**
  1. Login with valid user credentials
  2. Perform various authenticated actions
  3. Logout and verify session termination
  4. Attempt to access authenticated pages after logout
  5. Test session timeout handling
  6. Verify browser data cleanup on logout

**Expected Results:**
  - Logout terminates user session completely
  - Authenticated pages redirect to login after logout
  - Session timeouts are handled appropriately
  - Authentication tokens are cleared on logout
  - Browser storage is cleaned appropriately
