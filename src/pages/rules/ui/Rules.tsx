import { Box, Button, Checkbox, FormControlLabel, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'readRulesBlocks';

export const Rules = () => {
  const blocksStudent = [
    {
      id: 'student-1',
      title: 'Назначение платформы',
      text: 'Платформа предназначена для получения помощи в освоении учебного материала. Здесь Вы можете обратиться к наставнику — студенту, успешно изучившему нужную Вам тему. Это не способ получить готовый ответ, а возможность лучше понять предмет.',
    },
    {
      id: 'student-2',
      title: 'Как правильно оформить заявку',
      text: 'Четко укажите, в чём именно требуется помощь: предмет, тема, вид затруднения. Опишите, что уже предпринято самостоятельно. Старайтесь избегать общих формулировок. Заявки с просьбами «решить за меня» будут отклонены.',
    },
    {
      id: 'student-3',
      title: 'Правила общения с наставником',
      text: 'Поддерживайте уважительный и конструктивный тон. Наставник помогает добровольно. Старайтесь участвовать в обсуждении, задавайте уточняющие вопросы. Это ускорит понимание и сделает встречу более полезной.',
    },
    {
      id: 'student-4',
      title: 'Как извлечь максимальную пользу',
      text: 'Заранее подготовьтесь к встрече: просмотрите теоретический материал, подготовьте вопросы. Во время объяснения делайте заметки. После встречи попробуйте самостоятельно решить аналогичную задачу. Оставьте отзыв — это поможет другим и поблагодарит наставника.',
    },
    {
      id: 'student-5',
      title: 'Запрещенные действия',
      text: 'На платформе запрещено запрашивать готовые решения, покупать ответы, пересылать чужие работы. Также недопустимо нарушать границы общения или использовать платформу не по назначению. Все действия модерируются. Нарушения ведут к блокировке без предупреждения.\n\nПомните: цель платформы — развитие знаний. Ваша активность здесь — вклад в честное и осознанное обучение.',
    },
  ];

  const blocksMentor = [
    {
      id: 'mentor-1',
      title: 'Кто Вы и зачем Вы здесь',
      text: 'Вы — наставник. Студент, который владеет материалом и готов оказывать поддержку другим. Ваша цель — не решать задачи за обучающегося, а объяснять суть, направлять и помогать в понимании. Такая деятельность полезна не только обучающемуся, но и Вам — она способствует углублению знаний и развитию навыков коммуникации.',
    },
    {
      id: 'mentor-2',
      title: 'Как вести себя на встрече',
      text: 'Начинайте взаимодействие с уточнения: в какой теме у обучающегося возникли затруднения. Дайте ему возможность рассказать, что уже известно. Стройте объяснение поэтапно, приводите примеры, задавайте наводящие вопросы. Обеспечьте спокойную и уважительную атмосферу. Соблюдайте договоренности по времени и завершайте встречу, когда цель достигнута.',
    },
    {
      id: 'mentor-3',
      title: 'Эффективные методы объяснения',
      text: 'Начинайте с базовых понятий. Последовательно переходите к более сложным. Избегайте перегрузки терминами, используйте простые аналоги, схемы и сравнения. Регулярно проверяйте, насколько понятно изложение — предложите обучающемуся пересказать суть своими словами.',
    },
    {
      id: 'mentor-4',
      title: 'Учет особенностей восприятия',
      text: 'Разные обучающиеся по-разному воспринимают информацию. Учитывайте это:\n• визуалам подойдут схемы и записи;\n• аудиалам — устные пояснения;\n• кинестетикам — возможность практического применения.\n\nЕсли обучающийся прошёл когнитивный тест, Вы увидите его результат. При отсутствии теста можно задать уточняющие вопросы в начале общения.',
    },
    {
      id: 'mentor-5',
      title: 'Соблюдение правил сервиса',
      text: 'Платформа предназначена исключительно для поддержки в обучении. Запрещено выполнять задания за других, обсуждать способы списывания, размещать или откликаться на заявки с просьбой "решить" или "сдать".\n\nНарушения правил, в том числе неэтичное поведение, агрессия или давление, влекут немедленную блокировку аккаунта без предупреждения. Все чаты модерируются. Общение должно быть деловым и уважительным. При выявлении нарушений используйте форму обратной связи.\n\nПлатформа строится на доверии, взаимной помощи и уважении. Соблюдая правила, Вы делаете обучение честным и эффективным — и помогаете другим расти.',
    },
  ];

  const [readBlocks, setReadBlocks] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readBlocks));
  }, [readBlocks]);

  const toggleRead = (id: string) => {
    setReadBlocks(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderBlocks = (blocks: { id: string; title: string; text: string }[]) =>
    blocks.map(block => (
      <Paper
        key={block.id}
        elevation={readBlocks[block.id] ? 6 : 2}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
          backgroundColor: readBlocks[block.id] ? '#e6f4ea' : '#fafafa',
          border: readBlocks[block.id] ? '2px solid #4caf50' : '1px solid #e0e0e0',
          transition: 'all 0.3s',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ fontSize: { xs: '1.2rem', md: '1.4rem' } }}
          >
            {block.title}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!readBlocks[block.id]}
                onChange={() => toggleRead(block.id)}
                color="success"
              />
            }
            label="Прочитано"
          />
        </Box>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line',
            color: 'text.secondary',
            lineHeight: 1.7,
            fontSize: { xs: '0.95rem', md: '1.05rem' },
          }}
        >
          {block.text}
        </Typography>
      </Paper>
    ));

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography
        variant="h2"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{
          fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
        }}
      >
        Правила использования
      </Typography>

      <Box
        sx={{
          backgroundColor: '#f9fbe7',
          border: '1px solid #c5e1a5',
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          textAlign: 'center',
          mb: 5,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          Руководство для пользователей платформы
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            fontSize: { xs: '1rem', md: '1.1rem' },
            color: 'text.secondary',
          }}
        >
          Перед началом работы обязательно ознакомьтесь с полным руководством пользователя. В нём
          подробно описаны все возможности платформы и инструкции по работе. Это поможет вам
          избежать ошибок и использовать все функции эффективно.
        </Typography>
        <Button
          variant="contained"
          color="success"
          href="/user-guide.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Открыть руководство
        </Button>
      </Box>

      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{
          fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
        }}
      >
        Памятки для пользователей платформы
      </Typography>

      <Box sx={{ my: 5 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          Студенту
        </Typography>
        <Stack spacing={4}>{renderBlocks(blocksStudent)}</Stack>
      </Box>

      <Box sx={{ my: 5 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          Наставнику
        </Typography>
        <Stack spacing={4}>{renderBlocks(blocksMentor)}</Stack>
      </Box>
    </Box>
  );
};
