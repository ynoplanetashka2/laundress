'use client';
import Timetable from './TimeTable';
import SignInButton from './SignInButton';
import GoogleAccountInfo from './GoogleAccountInfo';
import LanguageSelect from './LanguageSelect';
import { useTranslations } from 'next-intl';

export default function Main() {
  const t = useTranslations('Timetable');
  // const [tabIndex, setTabIndex] = useState(0);
  // function handleTabChange(_: unknown, newValue: number) {
  //   setTabIndex(newValue);
  // }
  // function handleBookTime() {

  // }
  // return (
  //   <>
  //     <Button onClick={handleBookTime}/>
  //     <Tabs value={tabIndex} onChange={handleTabChange} >
  //       <Tab label="machine-1" />
  //       <Tab label="machine-2" />
  //     </Tabs>
  //     {
  //       tabIndex === 0 ? (
  //         <Schedule name="vasya" />
  //       ) : (
  //         <Schedule name="sasha" />
  //       )
  //     }
  //   </>
  // );
  return (
    <>
      <LanguageSelect /> <br />
      <GoogleAccountInfo />
      <SignInButton />
      <Timetable
        style={{
          height: '500px',
          width: '100vw',
          maxWidth: '800px',
          margin: '0 auto',
        }}
        events={{
          [t('monday')]: [
            {
              startTime: new Date('2024-09-14T05:00:00.000Z'),
              endTime: new Date('2024-09-14T06:30:00.000Z'),
              label: 'sasha',
            },
            {
              startTime: new Date('2024-09-14T06:45:00.000Z'),
              endTime: new Date('2024-09-14T07:30:00.000Z'),
              label: 'senya',
            },
          ],
          [t('tuesday')]: [
            {
              startTime: new Date('2024-09-14T06:00:00.000Z'),
              endTime: new Date('2024-09-14T08:00:00.000Z'),
              label: 'vasya',
            },
          ],
        }}
        daysOrder={[t('monday'),t('tuesday')]}
        timeColumnHeader={t('time')}
      />
    </>
  );
}
