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
    }
    
];
