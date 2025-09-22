import { config } from '@keystone-6/core';
import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  float,
  checkbox,
  image,
  file,
  json,
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import type { Lists } from '.keystone/types';

const lists: Lists = {
  // CORE USER MANAGEMENT
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: password({ validation: { isRequired: true } }),
      role: select({
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'Business Owner', value: 'business_owner' },
          { label: 'Editor', value: 'editor' },
        ],
        defaultValue: 'business_owner',
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  // GEOGRAPHIC DATA
  City: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({ 
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      state: text({ defaultValue: 'Oregon' }),
      population: integer(),
      description: text({ ui: { displayMode: 'textarea' } }),
      metaTitle: text(),
      metaDescription: text({ ui: { displayMode: 'textarea' } }),
      
      // Relationships
      businesses: relationship({ ref: 'Business.city', many: true }),
    },
    ui: {
      labelField: 'name',
    },
  }),

  // BUSINESS CATEGORIES
  Category: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({ 
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: text({ ui: { displayMode: 'textarea' } }),
      icon: text(), // For category icons/emojis
      color: text(), // Hex color for category theming
      
      // SEO
      metaTitle: text(),
      metaDescription: text({ ui: { displayMode: 'textarea' } }),
      
      // Relationships
      businesses: relationship({ ref: 'Business.category', many: true }),
      subcategories: relationship({ ref: 'Category', many: true }),
    },
    ui: {
      labelField: 'name',
    },
  }),

  // MAIN BUSINESS ENTITY
  Business: list({
    access: allowAll,
    fields: {
      // Basic Information
      name: text({ validation: { isRequired: true } }),
      slug: text({ 
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
        ],
        links: true,
        dividers: true,
      }),
      tagline: text(), // Short business tagline
      
      // Contact Information
      phone: text(),
      email: text(),
      website: text(),
      
      // Address
      address: text(),
      city: relationship({ ref: 'City.businesses' }),
      zipCode: text(),
      
      // Business Details  
      category: relationship({ ref: 'Category.businesses' }),
      yearsInBusiness: integer(),
      employeeCount: select({
        options: [
          { label: '1-5 employees', value: '1-5' },
          { label: '6-10 employees', value: '6-10' },
          { label: '11-25 employees', value: '11-25' },
          { label: '26-50 employees', value: '26-50' },
          { label: '50+ employees', value: '50+' },
        ],
      }),
      
      // Services & Features
      services: json({ 
        ui: { 
          views: './admin-ui/services-view',
          createView: { fieldMode: 'edit' },
        }
      }),
      specialties: text({ ui: { displayMode: 'textarea' } }),
      
      // Verification & Trust
      isVerified: checkbox({ defaultValue: false }),
      licenseNumber: text(),
      insuranceVerified: checkbox({ defaultValue: false }),
      bbbRating: select({
        options: [
          { label: 'A+', value: 'A+' },
          { label: 'A', value: 'A' },
          { label: 'A-', value: 'A-' },
          { label: 'B+', value: 'B+' },
          { label: 'B', value: 'B' },
          { label: 'B-', value: 'B-' },
          { label: 'Not Rated', value: 'not_rated' },
        ],
      }),
      
      // Business Operations
      emergencyServices: checkbox({ defaultValue: false }),
      freEstimates: checkbox({ defaultValue: false }),
      seniorDiscounts: checkbox({ defaultValue: false }),
      
      // Media
      logo: image({ storage: 'local_images' }),
      photos: json(), // Array of photo URLs
      
      // Business Status
      isActive: checkbox({ defaultValue: true }),
      isPremium: checkbox({ defaultValue: false }),
      subscriptionTier: select({
        options: [
          { label: 'Free Listing', value: 'free' },
          { label: 'Basic ($29/month)', value: 'basic' },
          { label: 'Premium ($79/month)', value: 'premium' },
          { label: 'Enterprise ($199/month)', value: 'enterprise' },
        ],
        defaultValue: 'free',
      }),
      
      // Analytics & Performance
      viewCount: integer({ defaultValue: 0 }),
      clickCount: integer({ defaultValue: 0 }),
      
      // SEO
      metaTitle: text(),
      metaDescription: text({ ui: { displayMode: 'textarea' } }),
      
      // Relationships
      reviews: relationship({ ref: 'Review.business', many: true }),
      businessHours: relationship({ ref: 'BusinessHours.business', many: true }),
      owner: relationship({ ref: 'User' }),
      
      // Timestamps
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        db: { updatedAt: true },
      }),
    },
    ui: {
      labelField: 'name',
    },
  }),

  // BUSINESS HOURS
  BusinessHours: list({
    access: allowAll,
    fields: {
      business: relationship({ ref: 'Business.businessHours' }),
      dayOfWeek: select({
        options: [
          { label: 'Monday', value: 'monday' },
          { label: 'Tuesday', value: 'tuesday' },
          { label: 'Wednesday', value: 'wednesday' },
          { label: 'Thursday', value: 'thursday' },
          { label: 'Friday', value: 'friday' },
          { label: 'Saturday', value: 'saturday' },
          { label: 'Sunday', value: 'sunday' },
        ],
        validation: { isRequired: true },
      }),
      openTime: text(), // Format: "09:00"
      closeTime: text(), // Format: "17:00" 
      isClosed: checkbox({ defaultValue: false }),
    },
  }),

  // CUSTOMER REVIEWS
  Review: list({
    access: allowAll,
    fields: {
      business: relationship({ ref: 'Business.reviews' }),
      customerName: text({ validation: { isRequired: true } }),
      customerEmail: text(),
      rating: select({
        options: [
          { label: '5 Stars', value: '5' },
          { label: '4 Stars', value: '4' },
          { label: '3 Stars', value: '3' },
          { label: '2 Stars', value: '2' },
          { label: '1 Star', value: '1' },
        ],
        validation: { isRequired: true },
      }),
      title: text(),
      content: text({ ui: { displayMode: 'textarea' } }),
      
      // Review Status
      isApproved: checkbox({ defaultValue: false }),
      isVerified: checkbox({ defaultValue: false }),
      
      // Timestamps
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
    ui: {
      labelField: 'title',
    },
  }),
};

export default config({
  db: {
    provider: 'sqlite',
    url: 'file:./keystone.db',
  },
  lists,
  storage: {
    local_images: {
      kind: 'local',
      type: 'image',
      generateUrl: path => `http://localhost:3000/images${path}`,
      serverRoute: {
        path: '/images',
      },
      storagePath: 'public/images',
    },
  },
  ui: {
    isAccessAllowed: (context) => !!context.session?.data,
  },
  session: {
    strategy: 'jwt',
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-this-in-production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});