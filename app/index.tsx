import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { appAbout, appName, appVersion } from '../src/constants/about';

const colors = {
  background: '#F5F8FC',
  ink: '#102A43',
  muted: '#52677D',
  navy: '#102A43',
  primary: '#0057B8',
  secondary: '#FFD43B',
  white: '#FFFFFF',
  paleBlue: '#EAF4FF',
  paleYellow: '#FFF6D6',
};

export default function LandingScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topline}>
        <View style={styles.logoMark}>
          <MaterialCommunityIcons name="message-processing" size={25} color={colors.white} />
        </View>
        <Text style={styles.wordmark}>{appName}</Text>
        <View style={styles.prototypeTag}>
          <Text style={styles.prototypeText}>PROTOTYPE</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.eyebrow}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrowText}>SUPPORT, BUILT IN</Text>
        </View>
        <Text style={styles.title}>Help is closer{ '\n' }than ever.</Text>
        <Text style={styles.description}>{appAbout}</Text>
      </View>

      <View style={styles.previewCard}>
        <Text style={styles.cardHeading}>One place to get support</Text>
        <Text style={styles.cardDescription}>Choose the way you want to connect.</Text>
        <View style={styles.supportOptions}>
          <View style={styles.option}>
            <View style={[styles.optionIcon, styles.imrIcon]}>
              <MaterialCommunityIcons name="headset" size={22} color={colors.navy} />
            </View>
            <Text style={styles.optionTitle}>IMR</Text>
            <Text style={styles.optionCaption}>In-app support</Text>
          </View>
          <View style={styles.optionDivider} />
          <View style={styles.option}>
            <View style={[styles.optionIcon, styles.chatIcon]}>
              <MaterialCommunityIcons name="chat-outline" size={22} color={colors.navy} />
            </View>
            <Text style={styles.optionTitle}>Live chat</Text>
            <Text style={styles.optionCaption}>Talk to our team</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>APP VERSION</Text>
        <Text style={styles.version}>{appVersion}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: colors.background,
  },
  topline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  wordmark: {
    color: colors.ink,
    fontFamily: 'Inter_700Bold',
    fontSize: 19,
    letterSpacing: -0.5,
  },
  prototypeTag: {
    marginLeft: 'auto',
    borderRadius: 20,
    backgroundColor: colors.paleYellow,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  prototypeText: {
    color: colors.navy,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.8,
  },
  hero: {
    paddingTop: 54,
    paddingBottom: 32,
  },
  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 17,
  },
  eyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  eyebrowText: {
    color: colors.muted,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 1.3,
  },
  title: {
    color: colors.ink,
    fontFamily: 'Inter_700Bold',
    fontSize: 40,
    lineHeight: 47,
    letterSpacing: -1.8,
  },
  description: {
    marginTop: 16,
    color: colors.muted,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 24,
  },
  previewCard: {
    borderRadius: 24,
    padding: 22,
    backgroundColor: colors.white,
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 3,
  },
  cardHeading: {
    color: colors.ink,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
  },
  cardDescription: {
    marginTop: 6,
    color: colors.muted,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  supportOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 23,
  },
  option: {
    flex: 1,
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 10,
  },
  imrIcon: {
    backgroundColor: colors.paleBlue,
  },
  chatIcon: {
    backgroundColor: colors.paleYellow,
  },
  optionTitle: {
    color: colors.ink,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  optionCaption: {
    marginTop: 4,
    color: colors.muted,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  optionDivider: {
    width: 1,
    height: 62,
    backgroundColor: '#E7EDF3',
    marginHorizontal: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 34,
  },
  footerLabel: {
    color: colors.muted,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 1,
  },
  version: {
    color: colors.ink,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
});
