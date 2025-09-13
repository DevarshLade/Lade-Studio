# E-commerce Admin Dashboard Development Prompt

## Project Overview
Create a comprehensive admin dashboard for the Lade Studio e-commerce website using Next.js 15.3.3, React 18.3.1, TypeScript, Tailwind CSS, and Supabase as the backend. The dashboard should provide complete management capabilities for all e-commerce operations.

## Technology Stack Requirements
- **Frontend**: Next.js 15.3.3 with App Router
- **React**: 18.3.1 with TypeScript
- **Styling**: Tailwind CSS 3.4.1 + Radix UI + shadcn/ui components
- **Backend**: Supabase (PostgreSQL database)
- **Authentication**: Supabase Auth with admin role management
- **State Management**: React Context API + React Query/TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts for analytics
- **File Upload**: Supabase Storage integration
- **Date Handling**: date-fns

## Dashboard Architecture

### 1. Authentication & Authorization System
```typescript
// Required admin authentication system
interface AdminUser {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: string[]
  created_at: string
  last_login: string
}

// Role-based access control
const permissions = {
  super_admin: ['*'], // All permissions
  admin: ['products:*', 'orders:*', 'users:read', 'reviews:*'],
  moderator: ['reviews:*', 'orders:read']
}
```

### 2. Dashboard Layout Structure
```
/admin
├── /dashboard           # Main dashboard home
├── /products           # Product management
│   ├── /               # Products list
│   ├── /add           # Add new product
│   ├── /[id]/edit     # Edit product
│   └── /categories    # Category management
├── /orders            # Order management
│   ├── /              # Orders list
│   ├── /[id]          # Order details
│   └── /analytics     # Order analytics
├── /customers         # Customer management
│   ├── /              # Customers list
│   ├── /[id]          # Customer details
│   └── /addresses     # Customer addresses
├── /reviews           # Review management
│   ├── /              # Reviews list
│   ├── /pending       # Pending reviews
│   └── /reported      # Reported reviews
├── /custom-designs    # Custom design requests
│   ├── /              # Requests list
│   ├── /[id]          # Request details
│   └── /analytics     # Design analytics
├── /analytics         # Overall analytics
├── /settings          # System settings
│   ├── /general       # General settings
│   ├── /shipping      # Shipping settings
│   ├── /payments      # Payment settings
│   └── /admins        # Admin user management
└── /profile           # Admin profile
```

## Database Schema Requirements

### 1. Admin Users Table
```sql
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) UNIQUE NOT NULL,
  role varchar(50) DEFAULT 'moderator',
  permissions jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  last_login timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### 2. Enhanced Existing Tables
```sql
-- Add delivery_charge to products table
ALTER TABLE products ADD COLUMN delivery_charge decimal(10,2) DEFAULT 50.00;

-- Add admin fields to orders table
ALTER TABLE orders ADD COLUMN admin_notes text;
ALTER TABLE orders ADD COLUMN processed_by uuid REFERENCES admin_users(id);
ALTER TABLE orders ADD COLUMN priority varchar(20) DEFAULT 'normal';

-- Add moderation fields to reviews table
ALTER TABLE reviews ADD COLUMN is_approved boolean DEFAULT false;
ALTER TABLE reviews ADD COLUMN moderated_by uuid REFERENCES admin_users(id);
ALTER TABLE reviews ADD COLUMN moderation_notes text;

-- Add analytics tracking
CREATE TABLE admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_users(id),
  action varchar(100) NOT NULL,
  table_name varchar(50),
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);
```

## Core Dashboard Features

### 1. Dashboard Home Page
- **Key Metrics Cards**:
  - Total Revenue (today, this week, this month)
  - Total Orders (pending, processing, completed)
  - Total Products (active, out of stock)
  - Total Customers (new this month)
  - Average Order Value
  - Conversion Rate

- **Charts & Analytics**:
  - Revenue trends (line chart)
  - Order status distribution (pie chart)
  - Top-selling products (bar chart)
  - Customer acquisition (area chart)
  - Geographic sales distribution (map)

- **Recent Activity Feed**:
  - New orders
  - New customer registrations
  - Low stock alerts
  - Pending reviews
  - Custom design requests

### 2. Product Management
```typescript
interface ProductManagement {
  // Product listing with advanced filters
  filters: {
    category: string[]
    priceRange: [number, number]
    stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock'
    featured: boolean
    dateRange: [Date, Date]
  }
  
  // Bulk operations
  bulkActions: [
    'update_prices',
    'update_categories',
    'toggle_featured',
    'update_stock',
    'delete_selected'
  ]
  
  // Product form fields
  productForm: {
    basic: ['name', 'slug', 'description', 'specification']
    pricing: ['price', 'original_price', 'delivery_charge']
    categorization: ['category', 'tags', 'size']
    media: ['images', 'gallery']
    seo: ['meta_title', 'meta_description', 'keywords']
    inventory: ['stock_quantity', 'sku', 'track_inventory']
    shipping: ['weight', 'dimensions', 'shipping_class']
  }
}
```

### 3. Order Management
```typescript
interface OrderManagement {
  // Order statuses with workflow
  statuses: [
    'pending',           // New order received
    'confirmed',         // Order confirmed by admin
    'processing',        // Order being prepared
    'shipped',          // Order shipped
    'delivered',        // Order delivered
    'cancelled',        // Order cancelled
    'refunded'          // Order refunded
  ]
  
  // Order filters and search
  filters: {
    status: string[]
    paymentMethod: ['online', 'cod']
    dateRange: [Date, Date]
    amountRange: [number, number]
    customerSearch: string
    deliveryArea: string[]
  }
  
  // Order actions
  actions: [
    'update_status',
    'add_tracking_number',
    'send_notification',
    'print_invoice',
    'process_refund',
    'add_notes'
  ]
}
```

### 4. Customer Management
```typescript
interface CustomerManagement {
  // Customer data view
  customerData: {
    personal: ['name', 'email', 'phone', 'registration_date']
    statistics: ['total_orders', 'total_spent', 'average_order_value']
    addresses: ['shipping_addresses', 'billing_addresses']
    orderHistory: ['past_orders', 'favorites', 'cart_items']
    activity: ['login_history', 'page_views', 'search_history']
  }
  
  // Customer segmentation
  segments: [
    'vip_customers',     // High value customers
    'frequent_buyers',   // Regular purchasers
    'new_customers',     // Recent registrations
    'inactive_customers', // Haven't ordered recently
    'cart_abandoners'    // Left items in cart
  ]
}
```

### 5. Review Management
```typescript
interface ReviewManagement {
  // Review moderation workflow
  moderationStates: [
    'pending',           // Awaiting approval
    'approved',          // Approved and visible
    'rejected',          // Rejected by moderator
    'reported',          // Reported by users
    'flagged'           // Flagged by system
  ]
  
  // Review filters
  filters: {
    status: 'pending' | 'approved' | 'rejected'
    rating: [1, 2, 3, 4, 5]
    hasImages: boolean
    dateRange: [Date, Date]
    productCategory: string[]
    reportedCount: number
  }
  
  // Bulk moderation actions
  bulkActions: [
    'approve_selected',
    'reject_selected',
    'flag_selected',
    'delete_selected'
  ]
}
```

### 6. Custom Design Management
```typescript
interface CustomDesignManagement {
  // Request workflow
  workflow: [
    'pending',           // New request received
    'reviewing',         // Under review
    'quoted',           // Price quoted
    'accepted',         // Quote accepted
    'in_progress',      // Work in progress
    'completed',        // Design completed
    'delivered',        // Design delivered
    'cancelled'         // Request cancelled
  ]
  
  // Request details view
  requestDetails: {
    customer: ['name', 'email', 'phone']
    design: ['category', 'product_type', 'reference_images']
    requirements: ['quantity', 'specifications', 'deadline']
    pricing: ['estimated_price', 'final_price', 'payment_status']
    communication: ['messages', 'notes', 'file_attachments']
  }
}
```

## Advanced Features

### 1. Analytics Dashboard
```typescript
interface AnalyticsDashboard {
  // Revenue analytics
  revenue: {
    timeframes: ['today', 'week', 'month', 'quarter', 'year']
    metrics: ['gross_revenue', 'net_revenue', 'refunds', 'taxes']
    comparisons: ['vs_previous_period', 'vs_same_period_last_year']
  }
  
  // Product analytics
  products: {
    topSelling: ['by_quantity', 'by_revenue']
    categoryPerformance: ['revenue_by_category', 'conversion_by_category']
    inventory: ['low_stock_alerts', 'out_of_stock_items']
  }
  
  // Customer analytics
  customers: {
    acquisition: ['new_customers', 'customer_sources']
    behavior: ['repeat_purchase_rate', 'customer_lifetime_value']
    geographic: ['sales_by_location', 'shipping_destinations']
  }
}
```

### 2. Inventory Management
```typescript
interface InventoryManagement {
  // Stock tracking
  stockLevels: {
    lowStockThreshold: number
    outOfStockAlerts: boolean
    reorderPoints: Record<string, number>
  }
  
  // Inventory operations
  operations: [
    'stock_adjustment',
    'bulk_update',
    'import_csv',
    'export_report'
  ]
  
  // Supplier management
  suppliers: {
    supplierInfo: ['name', 'contact', 'products']
    purchaseOrders: ['create', 'track', 'receive']
  }
}
```

### 3. Marketing Tools
```typescript
interface MarketingTools {
  // Promotional campaigns
  promotions: {
    discountCodes: ['percentage', 'fixed_amount', 'free_shipping']
    campaigns: ['email_campaigns', 'seasonal_sales']
    targeting: ['customer_segments', 'product_categories']
  }
  
  // Content management
  content: {
    banners: ['homepage_banners', 'category_banners']
    announcements: ['site_notifications', 'promotional_messages']
    seo: ['meta_tags', 'sitemap_management']
  }
}
```

### 4. Settings & Configuration
```typescript
interface SystemSettings {
  // General settings
  general: {
    siteName: string
    logo: string
    contactInfo: Record<string, string>
    businessHours: Record<string, string>
  }
  
  // Shipping settings
  shipping: {
    zones: ['domestic', 'international']
    methods: ['standard', 'express', 'overnight']
    rates: Record<string, number>
    freeShippingThreshold: number
  }
  
  // Payment settings
  payments: {
    gateways: ['online', 'cod', 'wallet']
    codCharges: number
    paymentMethods: string[]
  }
  
  // Notification settings
  notifications: {
    emailTemplates: ['order_confirmation', 'shipping_notification']
    smsSettings: ['enabled', 'templates']
    adminAlerts: ['low_stock', 'new_orders', 'customer_messages']
  }
}
```

## User Interface Requirements

### 1. Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop full-screen layouts
- Touch-friendly interfaces

### 2. Component Library
```typescript
// Required UI components
interface UIComponents {
  navigation: ['Sidebar', 'TopNav', 'Breadcrumbs']
  dataDisplay: ['DataTable', 'Cards', 'Charts', 'Metrics']
  forms: ['FormBuilder', 'FileUpload', 'DatePicker', 'MultiSelect']
  feedback: ['Toast', 'Modal', 'ConfirmDialog', 'Loading']
  layout: ['PageLayout', 'Section', 'Tabs', 'Accordion']
}
```

### 3. Dark/Light Mode
- Theme switching capability
- Persistent theme preference
- Accessible color schemes

## Security Requirements

### 1. Authentication
```typescript
// Multi-factor authentication
interface AdminAuth {
  login: ['email_password', 'two_factor_auth']
  session: ['jwt_tokens', 'refresh_tokens', 'session_timeout']
  permissions: ['role_based_access', 'route_protection']
}
```

### 2. Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF tokens
- Rate limiting
- Audit logging

### 3. Row Level Security (RLS)
```sql
-- Admin access policies
CREATE POLICY "Admin full access" ON products
FOR ALL TO authenticated
USING (auth.jwt() ->> 'role' IN ('admin', 'super_admin'));

CREATE POLICY "Moderator read access" ON products
FOR SELECT TO authenticated
USING (auth.jwt() ->> 'role' = 'moderator');
```

## Performance Requirements

### 1. Optimization
- Server-side rendering (SSR)
- Client-side caching
- Image optimization
- Code splitting
- Lazy loading

### 2. Database Optimization
- Proper indexing
- Query optimization
- Connection pooling
- Caching strategies

## Testing Requirements

### 1. Testing Strategy
```typescript
// Test coverage requirements
interface TestCoverage {
  unit: 'Jest + React Testing Library'
  integration: 'Playwright/Cypress'
  api: 'Supertest'
  e2e: 'Full user workflow testing'
}
```

### 2. Quality Assurance
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Husky pre-commit hooks

## Deployment & DevOps

### 1. Environment Setup
- Development environment
- Staging environment
- Production environment
- Environment variables management

### 2. CI/CD Pipeline
- Automated testing
- Build optimization
- Deployment automation
- Error monitoring

## Additional Features

### 1. Real-time Features
- Live order updates
- Real-time notifications
- Live chat support
- Activity monitoring

### 2. Backup & Recovery
- Database backups
- File storage backups
- Disaster recovery plan
- Data migration tools

### 3. API Development
- RESTful API endpoints
- API documentation
- Rate limiting
- API versioning

## File Structure
```
/admin-dashboard
├── /src
│   ├── /app
│   │   └── /admin
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── /dashboard
│   │       ├── /products
│   │       ├── /orders
│   │       ├── /customers
│   │       ├── /reviews
│   │       ├── /custom-designs
│   │       ├── /analytics
│   │       └── /settings
│   ├── /components
│   │   ├── /admin
│   │   │   ├── /layout
│   │   │   ├── /dashboard
│   │   │   ├── /products
│   │   │   ├── /orders
│   │   │   └── /common
│   │   └── /ui
│   ├── /lib
│   │   ├── /admin-api
│   │   ├── /auth
│   │   ├── /utils
│   │   └── /validations
│   ├── /hooks
│   │   ├── /admin
│   │   └── /common
│   ├── /types
│   │   ├── /admin.ts
│   │   └── /database.ts
│   └── /styles
├── /docs
│   ├── /admin-guide
│   └── /api-docs
└── /tests
    ├── /unit
    ├── /integration
    └── /e2e
```

## Success Metrics
- Page load times < 2 seconds
- 99.9% uptime
- Mobile responsiveness score > 95
- Accessibility score (WCAG AA)
- User satisfaction rating > 4.5/5

This comprehensive admin dashboard will provide complete control over your e-commerce operations while maintaining security, performance, and user experience standards.