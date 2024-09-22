import GoogleAccountInfo from '@/components/GoogleAccountInfo';
import LanguageSelect from '@/components/LanguageSelect';
import SignInButton from '@/components/SignInButton';
import { Card, Paper, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function Forbidden() {
  const t = useTranslations('Forbidden')
  return (
    <>
      <div className="w-20">
        <LanguageSelect />
      </div>
      <Card variant="elevation" className="w-min p-3 my-2 mx-auto">
        <GoogleAccountInfo />
        <div className="flex justify-center my-2">
          <SignInButton />
        </div>
      </Card>
      <Paper sx={{ padding: '1em', marginTop: '1em', }}>
        <Typography variant='h6' className="text-amber-500">
          { t('noAccess') }
        </Typography>
      </Paper>
    </>
  );
}
