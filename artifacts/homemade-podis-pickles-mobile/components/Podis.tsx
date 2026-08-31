import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useStore, Product, products, formatPrice } from '@/lib/store';
import colors from '@/constants/colors';

export function Screen({ children, title, right }: { children: React.ReactNode; title?: string; right?: React.ReactNode }) {
  const inset = useSafeAreaInsets();
  return <View style={s.screen}><View style={[s.header, { paddingTop: inset.top + 12 }]}>{title ? <Text style={s.headerTitle}>{title}</Text> : <Text style={s.wordmark}>HOMEMADE<Text style={s.wordmarkSmall}> PODIS & PICKLES</Text></Text>}{right}</View><ScrollView contentContainerStyle={[s.content, { paddingBottom: inset.bottom + 105 }]} showsVerticalScrollIndicator={false}>{children}</ScrollView></View>;
}
export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  return <Pressable testID={`product-${product.id}`} onPress={() => router.push(`/product/${product.id}`)} style={[s.card, compact && { width: 175 }]}><Image source={product.image} style={s.productImage} /><View style={s.cardBody}><Text style={s.meta}>{product.category} · SMALL BATCH</Text><Text style={s.productName}>{product.shortName}</Text><Text style={s.description} numberOfLines={2}>{product.description}</Text><Text style={s.price}>{formatPrice(product.price)}</Text></View></Pressable>;
}
export function HomeScreen() {
  return <Screen><View style={s.location}><Ionicons name="location-outline" size={16} color={colors.light.destructive} /><Text>Delivering to <Text style={{ fontWeight: '700', color: colors.light.foreground }}>Banjara Hills</Text></Text><Ionicons name="chevron-forward" size={14} color={colors.light.mutedForeground} /></View>
    <View style={s.hero}><Image source={require('@/assets/images/podis-hero.jpg')} style={StyleSheet.absoluteFillObject} /><View style={s.heroShade}/><View style={s.heroText}><Text style={s.badge}>FRESH BATCH TODAY</Text><Text style={s.heroTitle}>The jar that{'\n'}<Text style={s.saffron}>fixes</Text> plain rice.</Text><Text style={s.heroCopy}>Slow-roasted spices. Bright, honest heat. Packed this morning.</Text><Pressable testID="hero-product" onPress={() => router.push('/product/nalla-karam')} style={s.lightButton}><Text style={s.buttonText}>Meet Nalla Karam  ↗</Text></Pressable></View></View>
    <Text style={s.sectionLabel}>SHOP BY MOOD</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}><Mood title="The podi shelf" note="Roasted & nutty" color="#b65b3d" category="Podi"/><Mood title="Pickle weather" note="Tangy & loud" color="#66724e" category="Pickle"/><Mood title="Send some love" note="Ready to gift" color="#c58a43" category="Combo"/></ScrollView>
    <View style={s.sectionRow}><Text style={s.sectionTitle}>Good this week</Text><Pressable testID="see-all" onPress={() => router.push('/(tabs)/discover')}><Text style={s.link}>See all</Text></Pressable></View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>{products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} compact/>)}</ScrollView>
    <View style={s.story}><Image source={require('@/assets/images/podis-kitchen.jpg')} style={s.storyImage}/><View style={{ flex: 1 }}><Text style={[s.meta, { color: colors.light.accentForeground }]}>WHY IT TASTES DIFFERENT</Text><Text style={s.storyTitle}>Made like home,{'\n'}not a factory.</Text><Text style={[s.description, { color: colors.light.accentForeground }]}>We roast, grind and pack in small batches. Nothing hides behind preservatives.</Text></View></View>
  </Screen>;
}
function Mood({ title, note, color, category }: { title: string; note: string; color: string; category: string }) { return <Pressable testID={`mood-${category}`} onPress={() => router.push({ pathname: '/(tabs)/discover', params: { category } })} style={[s.mood, { backgroundColor: color }]}><Text style={s.moodTitle}>{title}</Text><Text style={s.moodNote}>{note}</Text><Ionicons name="arrow-forward" size={17} color="#fffaf2" style={s.moodIcon}/></Pressable>; }
export function DiscoverScreen() {
  const [query, setQuery] = useState<string>(''); const [category, setCategory] = useState<string>('All'); const [heat, setHeat] = useState<string>('all');
  const results = products.filter((p) => (`${p.name} ${p.description}`).toLowerCase().includes(query.toLowerCase()) && (category === 'All' || p.category === category) && (heat === 'all' || p.heat === heat || (heat === 'gentle' && p.heat === 'medium')));
  return <Screen title="Discover" right={<Pressable testID="discover-bag" onPress={() => router.push('/(tabs)/bag')}><Ionicons name="bag-outline" size={22} color={colors.light.primary}/></Pressable>}><View style={s.search}><Ionicons name="search" size={18} color={colors.light.destructive}/><TextInput testID="search-input" value={query} onChangeText={setQuery} placeholder="Try “garlic”, “tangy”..." placeholderTextColor="#ad9986" style={s.input}/>{query ? <Pressable testID="clear-search" onPress={() => setQuery('')}><Ionicons name="close" size={17} color={colors.light.mutedForeground}/></Pressable> : null}</View><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>{['All', 'Podi', 'Pickle', 'Combo'].map((x) => <Pressable testID={`category-${x}`} key={x} onPress={() => setCategory(x)} style={[s.chip, category === x && s.chipActive]}><Text style={[s.chipText, category === x && { color: '#fffaf2' }]}>{x}</Text></Pressable>)}</ScrollView><Text style={s.sectionLabel}>HEAT LEVEL</Text><View style={s.heatRow}>{['all', 'gentle', 'fiery'].map((x) => <Pressable testID={`heat-${x}`} key={x} onPress={() => setHeat(x)} style={[s.heat, heat === x && s.heatActive]}><Text style={{ fontSize: 11, fontWeight: '700', color: heat === x ? colors.light.primary : colors.light.mutedForeground }}>{x === 'all' ? 'Any heat' : x[0].toUpperCase() + x.slice(1)}</Text></Pressable>)}</View><View style={s.sectionRow}><View><Text style={s.meta}>THE PANTRY SHELF</Text><Text style={s.sectionTitle}>All the good stuff</Text></View><Text style={s.description}>{results.length} jars</Text></View>{results.length ? <View style={s.grid}>{results.map((p) => <ProductCard key={p.id} product={p}/>)}</View> : <View style={s.empty}><Ionicons name="search-outline" size={25} color={colors.light.primary}/><Text style={s.storyTitle}>No jar by that name</Text><Text style={s.description}>Try a broader search, or clear the filters.</Text><Pressable testID="clear-filters" onPress={() => { setQuery(''); setCategory('All'); setHeat('all'); }}><Text style={s.link}>Clear all filters</Text></Pressable></View>}</Screen>;
}
export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.light.background },
  header: { paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordmark: { fontSize: 14, letterSpacing: 2, fontWeight: '800', color: colors.light.primary },
  wordmarkSmall: { fontSize: 9, letterSpacing: 1, color: colors.light.foreground },
  headerTitle: { fontFamily: 'serif', fontSize: 25, fontWeight: '700', color: colors.light.foreground },
  content: { paddingHorizontal: 20 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, marginBottom: 9, fontSize: 12 },
  hero: { height: 315, overflow: 'hidden', borderRadius: 27, backgroundColor: colors.light.primary, marginBottom: 31 },
  heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(53,27,23,.48)' },
  heroText: { flex: 1, justifyContent: 'flex-end', padding: 23 },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.light.secondary, color: '#5c281f', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: '#fffaf2', fontFamily: 'serif', fontSize: 35, lineHeight: 36, fontWeight: '700', marginTop: 10 },
  saffron: { color: '#f0c47a', fontStyle: 'italic' },
  heroCopy: { color: '#f9e7d3', fontSize: 12, lineHeight: 18, marginTop: 9, maxWidth: 260 },
  lightButton: { backgroundColor: '#fffaf2', borderRadius: 22, alignSelf: 'flex-start', paddingVertical: 11, paddingHorizontal: 15, marginTop: 16 },
  buttonText: { color: colors.light.primary, fontSize: 12, fontWeight: '800' },
  sectionLabel: { color: colors.light.mutedForeground, fontSize: 10, fontWeight: '800', letterSpacing: 1.7, marginBottom: 13, marginTop: 7 },
  mood: { height: 112, width: 150, borderRadius: 20, padding: 15, position: 'relative' },
  moodTitle: { color: '#fffaf2', fontWeight: '800', fontSize: 14, width: 105, lineHeight: 16 },
  moodNote: { color: '#fffaf2', opacity: .75, fontWeight: '600', fontSize: 10, marginTop: 8 },
  moodIcon: { position: 'absolute', right: 13, bottom: 12 },
  sectionRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 29, marginBottom: 13 },
  sectionTitle: { fontFamily: 'serif', color: colors.light.foreground, fontWeight: '700', fontSize: 25, marginTop: 4 },
  link: { color: colors.light.destructive, fontWeight: '800', fontSize: 11 },
  card: { width: '48%', borderRadius: 17, backgroundColor: colors.light.card, borderWidth: 1, borderColor: colors.light.border, overflow: 'hidden', marginBottom: 4 },
  productImage: { width: '100%', height: 135, resizeMode: 'cover' },
  cardBody: { padding: 11 },
  meta: { color: colors.light.destructive, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  productName: { color: colors.light.foreground, fontWeight: '800', fontSize: 14, marginTop: 5 },
  description: { color: colors.light.mutedForeground, fontSize: 11, lineHeight: 16, marginTop: 5 },
  price: { color: colors.light.foreground, fontWeight: '800', fontSize: 14, marginTop: 9 },
  story: { flexDirection: 'row', gap: 13, backgroundColor: colors.light.accent, borderRadius: 22, padding: 14, marginTop: 31, alignItems: 'center' },
  storyImage: { width: 94, height: 145, borderRadius: 15, resizeMode: 'cover' },
  storyTitle: { fontFamily: 'serif', color: colors.light.foreground, fontSize: 22, lineHeight: 23, fontWeight: '700', marginTop: 8 },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.light.card, borderWidth: 1, borderColor: colors.light.border, borderRadius: 16, padding: 13 },
  input: { flex: 1, color: colors.light.foreground, fontSize: 14, fontWeight: '600' },
  chips: { gap: 8, paddingVertical: 15 },
  chip: { borderWidth: 1, borderColor: colors.light.border, borderRadius: 20, paddingVertical: 9, paddingHorizontal: 16, backgroundColor: colors.light.card },
  chipActive: { backgroundColor: colors.light.primary, borderColor: colors.light.primary },
  chipText: { color: colors.light.mutedForeground, fontSize: 11, fontWeight: '800' },
  heatRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  heat: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, backgroundColor: colors.light.muted },
  heatActive: { backgroundColor: '#ead8b8' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 13 },
  empty: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#c9b7a3', borderRadius: 22, padding: 35, alignItems: 'center', gap: 9 },
});