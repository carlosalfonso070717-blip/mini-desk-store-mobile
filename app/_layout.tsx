import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartButton } from '../components/CartButton';
import { PRODUCTS_GC_TIME_MS, PRODUCTS_STALE_TIME_MS } from '../constants/config';
import { colors } from '../constants/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: PRODUCTS_STALE_TIME_MS,
      gcTime: PRODUCTS_GC_TIME_MS,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="products/index"
            options={{ title: 'Catálogo', headerRight: () => <CartButton /> }}
          />
          <Stack.Screen
            name="products/[id]"
            options={{ title: 'Detalle', headerRight: () => <CartButton /> }}
          />
          <Stack.Screen name="cart" options={{ title: 'Carrito' }} />
          <Stack.Screen name="checkout" options={{ title: 'Pago' }} />
          <Stack.Screen
            name="success"
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}