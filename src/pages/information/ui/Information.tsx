import { Box, Divider, Link, Paper, Stack, Typography } from '@mui/material';

export const Information = () => {
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{
          fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
        }}
      >
        Полезная информация для обучения и наставничества
      </Typography>

      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Как эффективно проводить встречи
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Typography>
            <strong>Выберите учебники:</strong> подготовьте как минимум два учебника — один с
            теорией, другой с практическими заданиями.
          </Typography>
          <Typography>
            <strong>Спланируйте встречу:</strong> заранее продумайте сценарии и цели встречи.
          </Typography>
          <Typography>
            <strong>На старте встречи:</strong>
            <ul>
              <li>Уточните знание базовых понятий и формул.</li>
              <li>Предложите несколько простых заданий для оценки уровня подготовки.</li>
            </ul>
          </Typography>
          <Typography>
            <strong>Во время общения:</strong> говорите спокойно, выбирайте темп речи, комфортный
            для собеседника. Поддерживайте деловой, но дружелюбный стиль общения.
          </Typography>
          <Typography>
            <strong>Построение встречи:</strong> опирайтесь на учебники и материалы курсов.
            Стремитесь к достижению учебных целей — учите, а не просто разговаривайте.
          </Typography>
          <Typography>
            <strong>Завершение встречи:</strong> подведите итоги, подчеркните достигнутый прогресс,
            дайте домашнее задание и рекомендации для самостоятельной работы.
          </Typography>
          <Typography>
            <strong>Работа в команде наставников:</strong> распределите роли и соблюдайте правила
            вежливого и логичного общения.
          </Typography>
          <Typography>
            <strong>Если возникли вопросы:</strong> обратитесь к преподавателю за советом.
          </Typography>
          <Typography>
            <strong>Если студент просит решить за него:</strong> вежливо откажитесь и предложите
            аналогичные задачи для самостоятельного решения.
          </Typography>
          <Typography>
            <strong>В случае конфликтов:</strong> сохраняйте спокойствие, напомните о правилах
            платформы и завершите встречу корректно.
          </Typography>
        </Stack>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Полезная литература и ресурсы
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Учебные пособия по обучению:
          </Typography>
          <ul>
            <li>
              Кудряшова Г.Ю. и др.{' '}
              <Link
                href="http://study.urfu.ru/view/Aid_view.aspx?AidId=7475"
                target="_blank"
                underline="none"
                color="primary"
              >
                Учись учиться
              </Link>
            </li>
            <li>
              Березовская Е.А. и др.{' '}
              <Link
                href="http://elar.urfu.ru/handle/10995/139953"
                target="_blank"
                underline="none"
                color="primary"
              >
                Учись учиться
              </Link>
            </li>
            <li>
              Силинг М.И.{' '}
              <Link
                href="https://biblioclub.ru/index.php?page=book&id=89946"
                target="_blank"
                underline="none"
                color="primary"
              >
                Как учиться с толком для карьеры и удовольствия для себя
              </Link>
            </li>
            <li>
              Пономарева О.Я., Охотников О.В.{' '}
              <Link
                href="https://openedu.ru/course/urfu/SMNGM/"
                target="_blank"
                underline="none"
                color="primary"
              >
                Онлайн-курс "Самоменеджмент"
              </Link>
            </li>
            <li>
              Березина Е.М. и др.{' '}
              <Link
                href="https://www.iprbookshop.ru/139950.html"
                target="_blank"
                underline="none"
                color="primary"
              >
                Практики чтения и письма в учебном процессе
              </Link>
            </li>
            <li>
              Тарева Е.Г.{' '}
              <Link
                href="https://www.iprbookshop.ru/26498.html"
                target="_blank"
                underline="none"
                color="primary"
              >
                Как учиться в университете. Практические советы для студентов
              </Link>
            </li>
            <li>
              Вершинина В.В., Морозова Л.Н.{' '}
              <Link
                href="https://www.iprbookshop.ru/59174.html"
                target="_blank"
                underline="none"
                color="primary"
              >
                От самопознания к саморегуляции
              </Link>
            </li>
            <li>
              Егорова Е.В. и др.{' '}
              <Link
                href="https://biblioclub.ru/index.php?page=book&id=709502"
                target="_blank"
                underline="none"
                color="primary"
              >
                Как учить учиться по-новому
              </Link>
            </li>
          </ul>

          <Typography variant="subtitle1" fontWeight="bold">
            Педагогика высшей школы:
          </Typography>
          <ul>
            <li>
              Лызь Н.А., Лызь А.Е.{' '}
              <Link
                href="https://biblioclub.ru/index.php?page=book&id=715361"
                target="_blank"
                underline="none"
                color="primary"
              >
                Новая педагогика высшей школы
              </Link>
            </li>
            <li>
              Макарова Н.С.{' '}
              <Link
                href="https://biblioclub.ru/index.php?page=book&id=115089"
                target="_blank"
                underline="none"
                color="primary"
              >
                Трансформация дидактики высшей школы
              </Link>
            </li>
            <li>
              Самойлов В.Д.{' '}
              <Link
                href="https://biblioclub.ru/index.php?page=book&id=618031"
                target="_blank"
                underline="none"
                color="primary"
              >
                Педагогика и психология высшей школы
              </Link>
            </li>
            <li>
              Гриднева С.В. и др.{' '}
              <Link
                href="https://biblioclub.ru/index.php?page=book&id=698778"
                target="_blank"
                underline="none"
                color="primary"
              >
                Психологическое сопровождение первокурсников
              </Link>
            </li>
            <li>
              Громкова М.Т.{' '}
              <Link
                href="https://biblioclub.ru/index.php?page=book&id=684689"
                target="_blank"
                underline="none"
                color="primary"
              >
                Педагогика высшей школы
              </Link>
            </li>
            <li>
              Попков В.А., Коржуев А.В.{' '}
              <Link
                href="https://www.iprbookshop.ru/13092.html"
                target="_blank"
                underline="none"
                color="primary"
              >
                Методология педагогики
              </Link>
            </li>
            <li>
              Каткова Е.Н.{' '}
              <Link
                href="https://www.iprbookshop.ru/85813.html"
                target="_blank"
                underline="none"
                color="primary"
              >
                Коммуникативные компетенции преподавателя высшей школы. Часть 1
              </Link>
            </li>
            <li>
              Быкова О.П. и др.{' '}
              <Link
                href="https://www.iprbookshop.ru/122652.html"
                target="_blank"
                underline="none"
                color="primary"
              >
                Педагогика высшей школы: коммуникативно-деятельностный подход
              </Link>
            </li>
          </ul>

          <Typography variant="subtitle1" fontWeight="bold">
            Психология, мотивация, самоменеджмент:
          </Typography>
          <ul>
            <li>
              Вильмар Шауфели, Дийкстра Питернель{' '}
              <Link
                href="https://www.iprbookshop.ru/51972.html"
                target="_blank"
                underline="none"
                color="primary"
              >
                Увлеченность работой
              </Link>
            </li>
            <li>
              Барабанщиков В.А.{' '}
              <Link
                href="https://www.iprbookshop.ru/88272.html"
                target="_blank"
                underline="none"
                color="primary"
              >
                Психология восприятия
              </Link>
            </li>
            <li>
              Меркулова О.П.{' '}
              <Link
                href="https://www.iprbookshop.ru/72463.html"
                target="_blank"
                underline="none"
                color="primary"
              >
                Практикум академической компетентности
              </Link>
            </li>
          </ul>

          <Typography variant="subtitle1" fontWeight="bold">
            Высшая математика:
          </Typography>
          <ul>
            <li>
              Письменный Д.Т. <i>Конспект лекций по высшей математике</i>.
            </li>
            <li>
              Данко П.Е., Попов А.Г. и др. <i>Высшая математика в упражнениях и задачах</i>.
            </li>
            <li>
              Фихтенгольц Г.М. <i>Основы математического анализа</i> (Том 1 и 2).
            </li>
            <li>
              Кудрявцев Л.Д. <i>Краткий курс математического анализа</i>.
            </li>
            <li>Сборник задач по математическому анализу. Кудрявцев Л.Д. и др.</li>
            <li>
              Зельдович Я.Б. <i>Высшая математика для начинающих и её приложения к физике</i>.
            </li>
          </ul>

          <Typography variant="subtitle1" fontWeight="bold">
            Программы модулей:
          </Typography>
          <ul>
            <li>
              <Link
                href="https://programs.edu.urfu.ru/media/rpm/00042691.pdf"
                target="_blank"
                underline="none"
                color="primary"
              >
                Рабочая программа модуля "Эффективные коммуникации"
              </Link>
            </li>
            <li>
              <Link
                href="https://programs.edu.urfu.ru/media/rpm/00044225.pdf"
                target="_blank"
                underline="none"
                color="primary"
              >
                Рабочая программа модуля "Дополнительные главы фундаментальных наук"
              </Link>
            </li>
          </ul>
        </Stack>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Typography variant="caption" display="block" textAlign="center" color="text.secondary">
        Для доступа к некоторым ресурсам требуется авторизация или подписка на внешних платформах.
      </Typography>
    </Box>
  );
};
