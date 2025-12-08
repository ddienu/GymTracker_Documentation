import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('../features/home/home.component')
    },
    {
        path: 'auth',
        loadComponent: () => import('../features/auth/auth.component')
    },
    {
        path: 'services',
        loadComponent: () => import('../features/services/services.component')
    },
    {
        path: 'services/add',
        loadComponent: () => import('../features/services/service-form/service-form.component')
    },
    {
        path: 'services/edit/:serviceId',
        loadComponent: () => import('../features/services/service-form/service-form.component')
    },
    {
        path: 'aboutUs',
        loadComponent: () => import('../features/about-us/about-us.component')
    },
    {
        path: 'client',
        loadComponent: () => import('../features/client/client.component')
    },
    {
        path: 'client/more_info/:id',
        loadComponent: () => import('../features/client/more-info/more-info.component')
    },
    {
        path: 'products',
        loadComponent: () => import('../features/product/product.component')
    },
    {
        path: 'products/add',
        loadComponent: () => import('../features/product/product_form/product-form.component')
    },
    {
        path: 'products/edit/:productId',
        loadComponent: () => import('../features/product/product_form/product-form.component')
    },
    {
        path: 'professionals',
        loadComponent: () => import('../features/professionals/professionals.component')
    },
    {
        path: 'add/professional',
        loadComponent: () => import('../features/professionals/professionals-form/professionals-form.component')
    },
    {
        path: 'cart',
        loadComponent: () => import('../features/cart/cart.component')
    },
    {
        path: 'appointment',
        loadComponent: () => import('../features/appointment/appointment.component')
    },
    {
        path: 'payments',
        loadComponent: () => import('../features/payment/payment.component')
    },
    {
        path: 'client-payments/:clientId',
        loadComponent: () => import('../features/payment/payment.component')
    },
];
