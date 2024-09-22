import { AppBar, Toolbar, Box, Avatar } from '@mui/material';
import LanguageSelect from './LanguageSelect';

type Props = {
  avatarSrc?: string | undefined;
  avatarAlt?: string | undefined;
}

export default function TopBar({ avatarSrc, avatarAlt }: Props) {
  return (
    <AppBar position="sticky">
      <Toolbar className='max-w-[800px] mx-auto w-[80vw] sm:w-[100vw]'>
        <Box className='max-w-30'>
          <LanguageSelect />
        </Box>
        {
          avatarAlt === undefined || avatarSrc === undefined 
          ? null
          : 
        <Avatar alt={avatarAlt} src={avatarSrc} />
        }
      </Toolbar>
    </AppBar>
  );
}
