<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100">
    <AppHeader />
    
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    
    <AppFooter />
  </div>
</template>
