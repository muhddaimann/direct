import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthBrandHeader, AuthField, AuthLoadingScreen, AuthPrimaryButton } from '../src/components/auth/authComponents';
import { ThemeToggle } from '../src/components/theme/themeToggle';
import { authConfig } from '../src/constants/auth';
import { useAuth } from '../src/hooks/useAuth';
import { useTheme } from '../src/hooks/useTheme';

export default function LoginScreen() {
  const { isRestoring, session, step, demoOtp, requestOtp, verifyOtp, resetAuthFlow } = useAuth();
  const { theme } = useTheme();
  const { fontScale } = useWindowDimensions();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      setPhoneNumber('');
      setOtp('');
    }
  }, [session]);

  if (isRestoring) return <AuthLoadingScreen />;
  if (session) return <Redirect href="/(tabs)/home" />;

  const handleRequestCode = () => {
    setOtp('');
    requestOtp(phoneNumber);
  };

  const handleVerify = async () => {
    setIsSubmitting(true);
    await verifyOtp(otp);
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: theme.layout.fill, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView style={{ flex: theme.layout.fill }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: theme.layout.fill, justifyContent: 'center', paddingHorizontal: theme.spacing.xl, paddingVertical: theme.spacing.xl, gap: theme.spacing.xl }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <ThemeToggle />
          </View>

          <AuthBrandHeader />

          <View style={{ gap: theme.spacing.lg, borderRadius: theme.radius.xl, borderWidth: theme.layout.standardBorderWidth, borderColor: theme.colors.border, padding: theme.spacing.xl, backgroundColor: theme.colors.surface, ...theme.shadow.card }}>
            <View style={{ gap: theme.spacing.xs }}>
              <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.heading.fontSize, lineHeight: theme.typography.heading.lineHeight * fontScale }}>
                {step === 'phone' ? 'Sign in' : 'Verify your number'}
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.body.fontSize, lineHeight: theme.typography.body.lineHeight * fontScale }}>
                {step === 'phone' ? 'Enter your mobile number to continue.' : `Enter the demo code for ${phoneNumber}.`}
              </Text>
            </View>

            {step === 'phone' ? (
              <>
                <AuthField
                  label="Mobile number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter mobile number"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  autoComplete="tel"
                  returnKeyType="done"
                  maxLength={18}
                  onSubmitEditing={handleRequestCode}
                />
                <Text style={{ color: theme.colors.textMuted, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>
                  Demo-only test number: {authConfig.demoEligiblePhone}
                </Text>
                <AuthPrimaryButton label="Continue" onPress={handleRequestCode} disabled={phoneNumber.length === 0} />
              </>
            ) : (
              <>
                <View style={{ gap: theme.spacing.xs, borderRadius: theme.radius.md, padding: theme.spacing.md, backgroundColor: theme.colors.infoSoft }}>
                  <Text style={{ color: theme.colors.info, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale }}>
                    Demo code · not sent by SMS
                  </Text>
                  <Text selectable style={{ color: theme.colors.textPrimary, fontFamily: theme.fontFamily.bold, fontSize: theme.typography.heading.fontSize, letterSpacing: theme.spacing.xs }}>
                    {demoOtp}
                  </Text>
                </View>
                <AuthField
                  label="One-time code"
                  value={otp}
                  onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, authConfig.otpLength))}
                  placeholder="Enter demo code"
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete="one-time-code"
                  returnKeyType="done"
                  maxLength={authConfig.otpLength}
                  onSubmitEditing={() => { void handleVerify(); }}
                />
                <AuthPrimaryButton label="Verify and sign in" onPress={() => { void handleVerify(); }} disabled={otp.length !== authConfig.otpLength} loading={isSubmitting} />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => { resetAuthFlow(); setOtp(''); }}
                  style={({ pressed }) => ({ minHeight: theme.size.touchTarget, alignItems: 'center', justifyContent: 'center', opacity: pressed ? theme.opacity.pressed : theme.opacity.full })}
                >
                  <Text style={{ color: theme.colors.primary, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.body.fontSize }}>
                    Use a different number
                  </Text>
                </Pressable>
              </>
            )}
          </View>

          <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
            <Text style={{ color: theme.colors.warning, fontFamily: theme.fontFamily.semibold, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale, textAlign: 'center' }}>
              NON-PRODUCTION AUTH DEMO
            </Text>
            <Text style={{ color: theme.colors.textMuted, fontFamily: theme.fontFamily.regular, fontSize: theme.typography.caption.fontSize, lineHeight: theme.typography.caption.lineHeight * fontScale, textAlign: 'center' }}>
              No phone number is contacted. This does not verify real CelcomDigi membership.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
