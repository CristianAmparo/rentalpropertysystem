<template>
  <footer class="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 pt-16 pb-8">
    <UContainer>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div class="md:col-span-1">
          <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl text-primary-500 mb-4">
            <UIcon name="i-heroicons-home-modern" class="w-8 h-8" />
            <span>RentalProperty</span>
          </NuxtLink>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Finding your perfect home has never been easier. We offer premium rental properties with a seamless application experience.
          </p>
        </div>
        
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
          <ul class="space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <li><NuxtLink to="/" class="hover:text-primary-500 transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/properties" class="hover:text-primary-500 transition-colors">Properties</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-primary-500 transition-colors">About Us</NuxtLink></li>
            <li><NuxtLink to="/contact" class="hover:text-primary-500 transition-colors">Contact</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
          <ul class="space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <li><NuxtLink to="/terms" class="hover:text-primary-500 transition-colors">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/privacy" class="hover:text-primary-500 transition-colors">Privacy Policy</NuxtLink></li>
          </ul>
        </div>
        
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
          <ul class="space-y-3 text-sm text-gray-500 dark:text-gray-400">
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
              <a href="mailto:support@rentalproperty.com" class="hover:text-primary-500 transition-colors">support@rentalproperty.com</a>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-phone" class="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </li>
            <li class="flex items-start gap-2">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mt-0.5" />
              <span>123 Property Ave, Suite 100<br/>New York, NY 10001</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          &copy; {{ new Date().getFullYear() }} RentalProperty. All rights reserved.
        </p>
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-globe-alt" color="neutral" variant="ghost" aria-label="Website" />
        </div>
      </div>
    </UContainer>
  </footer>
</template>
