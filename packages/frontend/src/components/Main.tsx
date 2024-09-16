import Timetable from './Timetable';
import SignInButton from './SignInButton';
import GoogleAccountInfo from './GoogleAccountInfo';
import LanguageSelect from './LanguageSelect';
import { getUsersEmails } from '@/api/getUsersEmails';
import { getTranslations } from 'next-intl/server';
import TagsEditList from './TagsEditList';

export default async function Main() {
  const t = await getTranslations('Timetable');
  const usersEmails = await getUsersEmails();
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
      <TagsEditList tags={['vasya', 'gena']} /> <br />
      <SignInButton />
      <pre>{ JSON.stringify(usersEmails, null, 2) }</pre>
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
