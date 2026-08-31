import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen, s } from '@/components/Podis';
import { formatPrice, products, useStore } from '@/lib/store';
import colors from '@/constants/colors';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((item) => item.id === id) ?? products[0];
  const store = useStore();
  const [size, setSize] = useState<string>('250 g');
  const [quantity, setQuantity] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [added, setAdded] = useState<boolean>(false);
  const price = product.price + (size === '500 g' ? 160 : size === '1 kg' ? 420 : 0);

  return (
    <Screen
      title="Product story"
      right={
        <Pressable testID="wishlist" onPress={() => store.toggleWish(product.id)}>
          <Ionicons
            name={store.wishlist.includes(product.id) ? 'heart' : 'heart-outline'}
            size={23}
            color={colors.light.primary}
          />
        </Pressable>
      }
    >
      <Pressable testID="back" onPress={() => router.back()} style={{ marginBottom: 10 }}>
        <Ionicons name="arrow-back" size={22} color={colors.light.primary} />
      </Pressable>

      <View style={{ borderRadius: 25, overflow: 'hidden', height: 290 }}>
        <Image source={product.image} style={{ width: '100%', height: '100%' }} />
        <Text style={[s.badge, { position: 'absolute', bottom: 14, left: 14 }]}>
          {product.tags[0].toUpperCase()}
        </Text>
      </View>

      <Text style={[s.meta, { marginTop: 22 }]}>
        {product.category} · SMALL BATCH
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={s.sectionTitle}>{product.name}</Text>
        <Text style={s.price}>★ {product.rating}</Text>
      </View>
      <Text style={s.description}>{product.description}</Text>

      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: colors.light.border,
          paddingVertical: 15,
          marginTop: 18,
        }}
      >
        <Text style={s.meta}>CHOOSE YOUR JAR</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          {['250 g', '500 g', '1 kg'].map((option) => (
            <Pressable
              testID={`size-${option}`}
              key={option}
              onPress={() => setSize(option)}
              style={[
                s.chip,
                size === option && s.heatActive,
                { flex: 1, alignItems: 'center' },
              ]}
            >
              <Text style={{ fontWeight: '800', color: colors.light.primary }}>{option}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 17,
        }}
      >
        <Text style={s.meta}>QUANTITY</Text>
        <View style={s.heatRow}>
          <Pressable
            testID="decrease"
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={s.heat}
          >
            <Text>−</Text>
          </Pressable>
          <Text style={{ padding: 9, fontWeight: '800' }}>{quantity}</Text>
          <Pressable
            testID="increase"
            onPress={() => setQuantity(quantity + 1)}
            style={s.heatActive}
          >
            <Text>＋</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        testID="ingredients"
        onPress={() => setOpen(!open)}
        style={{
          borderTopWidth: 1,
          borderColor: colors.light.border,
          paddingVertical: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontWeight: '800' }}>What's inside</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={17} />
      </Pressable>
      {open && (
        <Text style={s.description}>
          {product.ingredients.join(' · ')}. No preservatives, no artificial colours.
        </Text>
      )}

      <View
        style={{
          backgroundColor: colors.light.accent,
          padding: 13,
          borderRadius: 13,
          marginTop: 17,
        }}
      >
        <Text style={{ color: colors.light.accentForeground, fontWeight: '700', fontSize: 12 }}>
          Fresh delivery in 35–45 min to your area
        </Text>
      </View>

      <Pressable
        testID="add-to-bag"
        onPress={() => {
          store.add(product, size, quantity);
          setAdded(true);
        }}
        style={[
          s.lightButton,
          {
            backgroundColor: colors.light.primary,
            alignSelf: 'stretch',
            alignItems: 'center',
            marginTop: 14,
          },
        ]}
      >
        <Text style={[s.buttonText, { color: '#fffaf2' }]}>
          {added ? 'Added to your bag · View bag' : `Add to bag · ${formatPrice(price * quantity)}`}
        </Text>
      </Pressable>

      {added && (
        <Pressable testID="view-bag" onPress={() => router.push('/(tabs)/bag')}>
          <Text style={[s.link, { textAlign: 'center', marginTop: 12 }]}>Review your bag</Text>
        </Pressable>
      )}
    </Screen>
  );
}