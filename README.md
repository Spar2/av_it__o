# Прототип «Лента» и «Вопросы о вещи» для Авито (v3)

Статический кликабельный прототип. Без сборки и сервера: откройте `index.html` (работает и с `file://`, и на GitHub Pages). Данные иллюстративные. Состояние лежит в localStorage с префиксом `avp3_`. «Сбросить демо» находится в окне «i».

## Что есть
- Десктоп (основной режим, 1440–1920) и мобильная версия (переключатель «Мобильная версия» или ширина < 1024).
- Главная: плитки категорий, мега-меню, переключатель «Объявления | Лента».
- Поиск: подсказки, страница результатов, фильтры (цена, «только с ответами продавца», сортировка).
- Объявление: «Вопросы о вещи». Лучший ответ продавца стоит у цены. Контакты в вопросе ловит фильтр, есть приватный вопрос (уходит в чат).
- Страница модели: отзывы, лучшие ответы, объявления и посты.
- Лента (`#/feed`): фильтры, подписки, «Мои модели».
- «Поделиться опытом»: поиск модели, тип поста (Совет, Отзыв, Вопрос, Сравнение), заголовок, текст, фото. Роль ставится автоматически, контакты фильтруются. Пост сохраняется и встаёт первым в ленте и на странице модели.
- Онбординг при первом входе (выбрать 3–5 моделей или категорий).
- Демо-тур на 11 шагов («▶ Пройти демо»).
- Страница автора `#/author/<id>`, Избранное (сердечки), заглушка чата, тосты для остальных иконок.
- Метки «новое» и «уже есть» отделяют новые функции от того, что на Авито уже есть.

Данные заполнены только для Электроники. В остальных категориях честное пустое состояние.

## GitHub Pages
Загрузите содержимое архива в корень репозитория, затем Settings → Pages → Deploy from branch → main / root.

## Фото (Wikimedia Commons, свободные лицензии)
Фото обрезаны до 600×600. Если файла нет, показывается SVG-заглушка.

| Файл | Оригинал | Автор | Лицензия | Ссылка |
|---|---|---|---|---|
| iphone11_3.jpg | File:2019-12-22 IPhone 11 Pro.jpg | Shinji | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:2019-12-22_IPhone_11_Pro.jpg |
| iphone11_4.jpg | File:IPhone XS and iPhone 11 Pro together.jpg | TzarN64 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:IPhone_XS_and_iPhone_11_Pro_together.jpg |
| mba-m1_1.jpg | File:MacBook Air M1.png | Padgriffin | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:MacBook_Air_M1.png |
| mba-m1_2.jpg | File:Macbook Air M1 Silver PNG.png | L | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Macbook_Air_M1_Silver_PNG.png |
| mba-m1_3.jpg | File:MacBook M1.jpg | Wilfredor | CC0 | https://commons.wikimedia.org/wiki/File:MacBook_M1.jpg |
| mba-m1_4.jpg | File:Macbook Air 2020 (M1).jpg | Jelican9 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Macbook_Air_2020_(M1).jpg |
| a6400_1.jpg | File:2022-02-17 Sony alpha 6400 IMG20220217210008.jpg | Eckhard Henkel | CC BY-SA 3.0 de | https://commons.wikimedia.org/wiki/File:2022-02-17_Sony_alpha_6400_IMG20220217210008.jpg |
| a6400_2.jpg | File:Sony alpha 6400 (04-08-2023).jpg | PaulGorduiz106 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Sony_alpha_6400_(04-08-2023).jpg |
| a6400_3.jpg | File:Sony ILCE-6400 27 Feb 2019a.jpg | 昼落ち | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Sony_ILCE-6400_27_Feb_2019a.jpg |
| a6400_4.jpg | File:Sony ILCE-6400 27 Feb 2019b.jpg | 昼落ち | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Sony_ILCE-6400_27_Feb_2019b.jpg |
| airpods_1.jpg | File:AirPods Pro (2nd generation).jpg | Hajoon0102 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:AirPods_Pro_(2nd_generation).jpg |
| airpods_2.jpg | File:Apple AirPods and Apple AirPods Pro at the Media Markt, Rotterdam-Centrum, Rotterdam (2021) 01.jpg | Donald Trung Quoc Don (Chữ Hán: 徵國單) - Wikimedia Commons - © CC BY-SA 4.0 Intern | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Apple_AirPods_and_Apple_AirPods_Pro_at_the_Media_Markt,_Rotterdam-Centrum,_Rotterdam_(2021)_01.jpg |
| airpods_3.jpg | File:Apple AirPods and Apple AirPods Pro at the Media Markt, Rotterdam-Centrum, Rotterdam (2021) 02.jpg | Donald Trung Quoc Don (Chữ Hán: 徵國單) - Wikimedia Commons - © CC BY-SA 4.0 Intern | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Apple_AirPods_and_Apple_AirPods_Pro_at_the_Media_Markt,_Rotterdam-Centrum,_Rotterdam_(2021)_02.jpg |
| airpods_4.jpg | File:AirPods Pro 1.jpg | — aconcagua (talk) | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:AirPods_Pro_1.jpg |
| ps5_2.jpg | File:PlayStation 5 and DualSense.jpg | Osh33m | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:PlayStation_5_and_DualSense.jpg |
| seiko_1.jpg | File:Seiko 5.jpg | Isik | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Seiko_5.jpg |
| seiko_2.jpg | File:Seiko 5 Automatic 21 Jewels.png | Kskhh | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Seiko_5_Automatic_21_Jewels.png |
| seiko_3.jpg | File:Vintage Seiko 5 Men's Automatic (Self-Winding) Wristwatch, Day-Date, Made In Japan (15871131175).jpg | Joe Haupt from USA | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Vintage_Seiko_5_Men%27s_Automatic_(Self-Winding)_Wristwatch,_Day-Date,_Made_In_Japan_(15871131175).jpg |
| seiko_4.jpg | File:Seiko-5-blue-gold.jpg | Luekk | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Seiko-5-blue-gold.jpg |
| switch_1.jpg | File:Nintendo-Switch-Console-Docked-wJoyConRB.jpg | Evan-Amos | Public domain | https://commons.wikimedia.org/wiki/File:Nintendo-Switch-Console-Docked-wJoyConRB.jpg |
| switch_2.jpg | File:Nintendo Switch – OLED-Modell mit gedockter Konsole 20230506 HOF01624 RAW-Export.png | PantheraLeo1359531 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Nintendo_Switch_%E2%80%93_OLED-Modell_mit_gedockter_Konsole_20230506_HOF01624_RAW-Export.png |
| switch_3.jpg | File:Nintendo Switch – OLED-Modell-Docking Station 20230506 HOF01637 RAW-Export.png | PantheraLeo1359531 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Nintendo_Switch_%E2%80%93_OLED-Modell-Docking_Station_20230506_HOF01637_RAW-Export.png |
| switch_4.jpg | File:Nintendo Switch – OLED-Modell, Konsole und Dock 20230506.png | PantheraLeo1359531 | CC BY 4.0 | https://commons.wikimedia.org/wiki/File:Nintendo_Switch_%E2%80%93_OLED-Modell,_Konsole_und_Dock_20230506.png |
| kindle_1.jpg | File:2023 Amazon Kindle Paperwhite (2).jpg | Jacek Halicki | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:2023_Amazon_Kindle_Paperwhite_(2).jpg |
| kindle_2.jpg | File:2023 Amazon Kindle Paperwhite (3).jpg | Jacek Halicki | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:2023_Amazon_Kindle_Paperwhite_(3).jpg |
| kindle_3.jpg | File:2023 Amazon Kindle Paperwhite (1).jpg | Jacek Halicki | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:2023_Amazon_Kindle_Paperwhite_(1).jpg |
| kindle_4.jpg | File:Amazon Kindle Paperwhite 3.jpg | Wandelopa | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Amazon_Kindle_Paperwhite_3.jpg |
| iphone11_5.jpg | File:IPhone 11 RED.jpg | Ahmadkurdi44 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:IPhone_11_RED.jpg |
| iphone11_7.jpg | File:IPhone 11 all color.jpg | Ahmadkurdi44 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:IPhone_11_all_color.jpg |
| iphone11_8.jpg | File:Back view of iPhone 11 white.jpg | メイド理世 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Back_view_of_iPhone_11_white.jpg |
| ps5_6.jpg | File:PlayStation 5 and DualSense (2).jpg | Osh33m | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:PlayStation_5_and_DualSense_(2).jpg |
| ps5_7.jpg | File:Immagine Playstation 5.jpg | Gianlupisa1 | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Immagine_Playstation_5.jpg |
