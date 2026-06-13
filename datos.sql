--
-- PostgreSQL database dump
--

\restrict PPh4pLBKdjX3Nh8OCl8ugYTnuXr9MsueLTmMIuSkU3QzQnmoluhKynwPE2VVuXe

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.clientes VALUES ('836a8566-2b91-47ec-8d22-4cd1b5f73841', 'AntonioCpp', '946613245', 'antonio@hotmail.com', 'Av siempre viva', 'web', '2026-05-06 00:42:57.283', '$2a$10$BQj/xOHhL5a3kn4RfdkLyOSziGBiA/Wgxc30aCthE/fnQpIU1WsYO');
INSERT INTO public.clientes VALUES ('d7a9cffb-a40c-450c-8d16-4a544e6cb104', 'Sebastian Simon', '956845684', 'esnorbi8@hotmail.com', 'JR paty', 'web', '2026-06-07 07:46:55.069', '$2a$10$whfsoWRhmB9P5iQqOhzmRuQyNEjcivNj7RlO0wuMju0G.ku2RkgfC');


--
-- Data for Name: carritos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categorias VALUES (1, 'Cemento y Concreto', NULL, '🏗️', true);
INSERT INTO public.categorias VALUES (2, 'Herramientas Manuales', NULL, '🔨', true);
INSERT INTO public.categorias VALUES (3, 'Herramientas Eléctricas', NULL, '⚡', true);
INSERT INTO public.categorias VALUES (4, 'Plomería', NULL, '🚿', true);
INSERT INTO public.categorias VALUES (5, 'Electricidad', NULL, '💡', true);
INSERT INTO public.categorias VALUES (6, 'Pintura', NULL, '🎨', true);
INSERT INTO public.categorias VALUES (7, 'Fierro y Acero', NULL, '⚙️', true);
INSERT INTO public.categorias VALUES (8, 'Madera y Triplay', NULL, '🪵', true);
INSERT INTO public.categorias VALUES (9, 'Seguridad', NULL, '🦺', true);
INSERT INTO public.categorias VALUES (10, 'Otros', NULL, '📦', true);


--
-- Data for Name: proveedores; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.productos VALUES (6, 'CEM-002', 'Cemento Inka x 42.5 kg', 'Cemento Portland tipo I marca Inka', 1, NULL, 27.00, 31.50, 'bolsa', 80, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306861/ferreteria-nasca/ixcvd9ayvaogopvqxu6j.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:27:43.857534');
INSERT INTO public.productos VALUES (9, 'CEM-005', 'Arena gruesa x m3', 'Arena gruesa para concreto', 1, NULL, 35.00, 45.00, 'm3', 20, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781307106/ferreteria-nasca/s56prsflqes0au5iktdq.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:31:47.376315');
INSERT INTO public.productos VALUES (17, 'FIE-006', 'Clavo 2" x kg', 'Clavos de acero 2 pulgadas, por kg', 7, NULL, 4.00, 6.00, 'kg', 80, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306727/ferreteria-nasca/yspruktvgba7fjctieet.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:25:28.995952');
INSERT INTO public.productos VALUES (45, 'PIN-002', 'Pintura latex colores x gl', 'Pintura látex colores 1 galón', 6, NULL, 30.00, 40.00, 'galón', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305894/ferreteria-nasca/vg2lxu4kkyk8fmwszm54.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:11:35.716861');
INSERT INTO public.productos VALUES (1, 'C1', 'Cemento sol', '', 1, NULL, 30.00, 40.00, 'unidad', 50, 5, '', false, false, false, '2026-05-05 17:42:39.378', '2026-06-12 18:27:19.396579');
INSERT INTO public.productos VALUES (26, 'PLO-007', 'Codo PVC 3/4" 90°', 'Codo PVC 3/4" a 90 grados', 4, NULL, 0.80, 1.50, 'unidad', 150, 20, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306631/ferreteria-nasca/k8vvazgij9akivuvvzpz.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:23:52.227859');
INSERT INTO public.productos VALUES (34, 'ELE-003', 'Cable TW 14 metro', 'Cable TW calibre 14 por metro', 5, NULL, 1.20, 1.80, 'metro', 500, 50, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306904/ferreteria-nasca/w7esfubjsfxfpircn4ow.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:28:26.031017');
INSERT INTO public.productos VALUES (11, 'CEM-007', 'Yeso x 18 kg', 'Yeso blanco para construcción', 1, NULL, 8.00, 12.00, 'bolsa', 50, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780816146/ferreteria-nasca/e9velpgfcohmw3tckqoo.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:09:10.222125');
INSERT INTO public.productos VALUES (24, 'PLO-005', 'Tubo PVC 4" x 3m desague', 'Tubo PVC desagüe 4" x 3m', 4, NULL, 22.00, 28.00, 'tubo', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780817735/ferreteria-nasca/z8ribyvx6htunmdqoh3f.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:35:35.675389');
INSERT INTO public.productos VALUES (21, 'PLO-002', 'Tubo PVC 3/4" x 3m agua', 'Tubo PVC presión 3/4" x 3m', 4, NULL, 8.00, 11.00, 'tubo', 50, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780817774/ferreteria-nasca/xsw7g4bizkxm30sxu2lx.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:36:17.263694');
INSERT INTO public.productos VALUES (23, 'PLO-004', 'Tubo PVC 2" x 3m desague', 'Tubo PVC desagüe 2" x 3m', 4, NULL, 12.00, 16.00, 'tubo', 40, 8, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780818001/ferreteria-nasca/almfzevvx7t3gkw2gkzo.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:40:01.895642');
INSERT INTO public.productos VALUES (22, 'PLO-003', 'Tubo PVC 1" x 3m agua', 'Tubo PVC presión 1" x 3m', 4, NULL, 11.00, 15.00, 'tubo', 40, 8, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780818055/ferreteria-nasca/eqvi2nuo09pxdeh6tc3q.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:40:55.946916');
INSERT INTO public.productos VALUES (43, 'ELE-012', 'Tubo conduit 3/4" x 3m', 'Tubo conduit PVC 3/4" x 3m', 5, NULL, 5.00, 7.50, 'tubo', 60, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780818175/ferreteria-nasca/xx6afgrzgps90bnvdz2o.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:42:55.942673');
INSERT INTO public.productos VALUES (10, 'CEM-006', 'Piedra chancada x m3', 'Piedra chancada 3/4 para concreto', 1, NULL, 55.00, 70.00, 'm3', 15, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306057/ferreteria-nasca/nbbnrly9wgb6ydh1zavo.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:14:18.304838');
INSERT INTO public.productos VALUES (42, 'ELE-011', 'Termico 20A monofasico', 'Interruptor termomagnético 20A', 5, NULL, 20.00, 28.00, 'unidad', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305644/ferreteria-nasca/rzeiwg1fylxexsrqxpp6.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:07:25.666616');
INSERT INTO public.productos VALUES (27, 'PLO-008', 'Tee PVC 1/2"', 'Tee PVC 1/2" para derivaciones', 4, NULL, 0.60, 1.20, 'unidad', 150, 20, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305693/ferreteria-nasca/viov8s5zptegq1k9wulg.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:08:14.876077');
INSERT INTO public.productos VALUES (4, 'H1', 'Serrucho', '', 2, NULL, 20.00, 40.00, 'unidad', 40, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305845/ferreteria-nasca/rohgtkokqzmwejquntrc.webp', true, true, true, '2026-05-05 17:43:51.697', '2026-06-12 18:10:47.877859');
INSERT INTO public.productos VALUES (46, 'PIN-003', 'Pintura esmalte blanco x gl', 'Pintura esmalte blanco 1 galón', 6, NULL, 35.00, 48.00, 'galón', 25, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305946/ferreteria-nasca/wpu1m45gg8xdqcxfto3y.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:12:27.328485');
INSERT INTO public.productos VALUES (28, 'PLO-009', 'Pegamento PVC 1/4 gl', 'Pegamento PVC 1/4 galón', 4, NULL, 12.00, 18.00, 'unidad', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306107/ferreteria-nasca/ytcr8tb8mnlno8iyswwa.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:15:08.841027');
INSERT INTO public.productos VALUES (29, 'PLO-010', 'Llave de paso 1/2"', 'Llave de paso bronce 1/2"', 4, NULL, 12.00, 18.00, 'unidad', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306257/ferreteria-nasca/xqrj6mktvyptrw7ufosh.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:17:38.416929');
INSERT INTO public.productos VALUES (48, 'PIN-005', 'Imprimante x bolsa 30kg', 'Imprimante para muros 30 kg', 6, NULL, 22.00, 30.00, 'bolsa', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306353/ferreteria-nasca/jakf4evzs8ssk0sjgpqp.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:19:14.951752');
INSERT INTO public.productos VALUES (38, 'ELE-007', 'Foco LED 9W', 'Foco LED 9W luz blanca E27', 5, NULL, 5.00, 8.00, 'unidad', 100, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306397/ferreteria-nasca/el6baniiozi9dpbcoht9.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:19:58.381541');
INSERT INTO public.productos VALUES (15, 'FIE-004', 'Fierro corrugado 5/8" x 9m', 'Varilla de fierro 16mm x 9 metros', 7, NULL, 58.00, 68.00, 'varilla', 80, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306444/ferreteria-nasca/oeuryu44ajtjvezreyhl.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:20:45.468265');
INSERT INTO public.productos VALUES (12, 'FIE-001', 'Fierro corrugado 1/4" x 9m', 'Varilla de fierro 6mm x 9 metros', 7, NULL, 12.00, 15.00, 'varilla', 200, 20, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306482/ferreteria-nasca/kgvvmpeocqgnjbhlcsdp.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:21:23.792835');
INSERT INTO public.productos VALUES (3, 'F1', 'Fierro 3 Pulgadas', '', 7, NULL, 1.00, 2.00, 'unidad', 99, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306529/ferreteria-nasca/qclv3jgzqdp6dodfwzdw.webp', true, true, true, '2026-05-05 17:43:27.878', '2026-06-12 18:22:10.73883');
INSERT INTO public.productos VALUES (19, 'FIE-008', 'Clavo 4" x kg', 'Clavos de acero 4 pulgadas, por kg', 7, NULL, 4.00, 6.00, 'kg', 60, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306689/ferreteria-nasca/zzo1h0rselzwfvhiibkj.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:24:50.292421');
INSERT INTO public.productos VALUES (31, 'PLO-012', 'Cinta teflon', 'Cinta de teflón para tuberías', 4, NULL, 0.50, 1.00, 'unidad', 200, 20, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306749/ferreteria-nasca/sbzyy2bztqsxc9lqyoei.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:25:51.382737');
INSERT INTO public.productos VALUES (2, 'C2', 'Cemento Yura', '', 1, NULL, 25.00, 40.00, 'unidad', 29, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306792/ferreteria-nasca/hgfjz0uxe4ixvxhakezl.webp', true, true, true, '2026-05-05 17:43:04.961', '2026-06-12 18:26:33.479258');
INSERT INTO public.productos VALUES (35, 'ELE-004', 'Cable TW 12 metro', 'Cable TW calibre 12 por metro', 5, NULL, 1.80, 2.50, 'metro', 400, 40, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306923/ferreteria-nasca/lxewpwyg3yso7dahivuh.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:28:44.737914');
INSERT INTO public.productos VALUES (32, 'ELE-001', 'Cable NYM 2x2.5mm metro', 'Cable NYM 2x2.5mm por metro', 5, NULL, 2.50, 3.50, 'metro', 499, 50, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306962/ferreteria-nasca/x7k2bl1nj5qvdzbjnhxy.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:29:23.917088');
INSERT INTO public.productos VALUES (8, 'CEM-004', 'Arena fina x m3', 'Arena fina para mezcla de concreto', 1, NULL, 35.00, 45.00, 'm3', 20, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781307124/ferreteria-nasca/d5dwveg9pjh6icplpbge.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:32:05.684924');
INSERT INTO public.productos VALUES (69, 'SEG-001', 'Casco de seguridad', 'Casco seguridad industrial blanco', 9, NULL, 12.00, 18.00, 'unidad', 20, 5, NULL, true, true, true, '2026-05-05 13:20:17.674304', '2026-05-05 13:20:17.674304');
INSERT INTO public.productos VALUES (63, 'HER-010', 'Serrucho 22"', 'Serrucho carpintero 22 pulgadas', 2, NULL, 20.00, 28.00, 'unidad', 10, 2, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305819/ferreteria-nasca/veuxe7lrxyx4egavcqvo.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:10:20.480008');
INSERT INTO public.productos VALUES (49, 'PIN-006', 'Rodillo de pintura 9"', 'Rodillo para pintura con mango', 6, NULL, 8.00, 12.00, 'unidad', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305869/ferreteria-nasca/gzamwxnym3otpwbtjpy8.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:11:11.440618');
INSERT INTO public.productos VALUES (44, 'PIN-001', 'Pintura latex blanco x gl', 'Pintura látex blanco 1 galón', 6, NULL, 28.00, 38.00, 'galón', 40, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305928/ferreteria-nasca/vvmgclx9gnqayxjbszus.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:12:09.694388');
INSERT INTO public.productos VALUES (51, 'PIN-008', 'Brocha 4"', 'Brocha de cerda 4 pulgadas', 6, NULL, 6.50, 10.00, 'unidad', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306983/ferreteria-nasca/edrq18nawdq4ujxic0so.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:29:45.011879');
INSERT INTO public.productos VALUES (47, 'PIN-004', 'Pintura anticorrosiva x gl', 'Pintura anticorrosiva 1 galón', 6, NULL, 40.00, 55.00, 'galón', 19, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306032/ferreteria-nasca/iwhvp0xyusrpw8c01xzl.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:13:53.719446');
INSERT INTO public.productos VALUES (56, 'HER-003', 'Pico', 'Pico doble punta para excavación', 2, NULL, 32.00, 42.00, 'unidad', 10, 2, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306081/ferreteria-nasca/b9rfuucjau4ay7whbwbw.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:14:43.117696');
INSERT INTO public.productos VALUES (55, 'HER-002', 'Palana punta', 'Palana punta para excavación', 2, NULL, 28.00, 38.00, 'unidad', 15, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306131/ferreteria-nasca/umxshbhkquruao8ol3pb.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:15:33.119394');
INSERT INTO public.productos VALUES (57, 'HER-004', 'Badilejo 6"', 'Badilejo acero 6 pulgadas', 2, NULL, 8.00, 12.00, 'unidad', 25, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781307082/ferreteria-nasca/uva4kngobhrkxbxaiczm.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:31:23.836774');
INSERT INTO public.productos VALUES (60, 'HER-007', 'Wincha 8m', 'Cinta métrica 8 metros', 2, NULL, 12.00, 18.00, 'unidad', 15, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780817657/ferreteria-nasca/tktkpksups9mznu24d6a.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:34:20.217093');
INSERT INTO public.productos VALUES (59, 'HER-006', 'Wincha 5m', 'Cinta métrica 5 metros', 2, NULL, 8.00, 12.00, 'unidad', 20, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780817685/ferreteria-nasca/qprfc9urdoqlmvzmapfk.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:34:46.228675');
INSERT INTO public.productos VALUES (20, 'PLO-001', 'Tubo PVC 1/2" x 3m agua', 'Tubo PVC presión 1/2" x 3m', 4, NULL, 5.50, 8.00, 'tubo', 60, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780818035/ferreteria-nasca/fq857ivlelugiiidnnuh.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:40:36.468773');
INSERT INTO public.productos VALUES (73, 'MAD-002', 'Triplay 6mm 1.22x2.44m', 'Triplay 6mm plancha completa', 8, NULL, 38.00, 50.00, 'plancha', 15, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780818196/ferreteria-nasca/shaomkctyrtmhpzxbnry.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:43:17.268391');
INSERT INTO public.productos VALUES (72, 'MAD-001', 'Triplay 4mm 1.22x2.44m', 'Triplay 4mm plancha completa', 8, NULL, 28.00, 38.00, 'plancha', 20, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780818329/ferreteria-nasca/dmcemjuetxrc3qccuslz.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:45:30.183851');
INSERT INTO public.productos VALUES (37, 'ELE-006', 'Tomacorriente doble', 'Tomacorriente doble con tierra', 5, NULL, 6.00, 9.00, 'unidad', 50, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1780818364/ferreteria-nasca/ehfwkgeyhewh7pwhp67s.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-07 02:46:05.717442');
INSERT INTO public.productos VALUES (53, 'PIN-010', 'Thinner acrilico x litro', 'Thinner acrílico por litro', 6, NULL, 5.00, 8.00, 'litro', 39, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305604/ferreteria-nasca/oj1n3xmyadg1rrclsiz0.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:06:49.71607');
INSERT INTO public.productos VALUES (41, 'ELE-010', 'Termico 16A monofasico', 'Interruptor termomagnético 16A', 5, NULL, 18.00, 25.00, 'unidad', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305670/ferreteria-nasca/fbqwsj2aamsxr5wmbwoo.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:07:51.872893');
INSERT INTO public.productos VALUES (64, 'EHE-001', 'Taladro percutor 500W', 'Taladro percutor 500W con maletín', 3, NULL, 120.00, 160.00, 'unidad', 8, 2, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781305795/ferreteria-nasca/nvveyoshuqli3u1bi9cq.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:09:56.496976');
INSERT INTO public.productos VALUES (54, 'HER-001', 'Palana cuchara', 'Palana cuchara para albañilería', 2, NULL, 12.00, 18.00, 'unidad', 20, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306163/ferreteria-nasca/lil2dgwtujqe8vz7p3pl.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:16:06.285826');
INSERT INTO public.productos VALUES (58, 'HER-005', 'Nivel de burbuja 60cm', 'Nivel aluminio 60 cm', 2, NULL, 18.00, 25.00, 'unidad', 15, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306187/ferreteria-nasca/x44y5nxgiqoebdhtx6ad.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:16:28.944978');
INSERT INTO public.productos VALUES (61, 'HER-008', 'Martillo carpintero', 'Martillo con mango de madera', 2, NULL, 18.00, 25.00, 'unidad', 15, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306208/ferreteria-nasca/ipd8tjkpnmcxtecf3ulx.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:16:50.423433');
INSERT INTO public.productos VALUES (74, 'MAD-003', 'Madera tornillo 2x4" x 3m', 'Madera tornillo 2x4" x 3m', 8, NULL, 16.00, 22.00, 'unidad', 25, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306226/ferreteria-nasca/lhldlmxxynw0jbscvmc7.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:17:07.637433');
INSERT INTO public.productos VALUES (30, 'PLO-011', 'Llave de paso 3/4"', 'Llave de paso bronce 3/4"', 4, NULL, 16.00, 22.00, 'unidad', 20, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306242/ferreteria-nasca/fmsoimakk4kp5ewbpwkc.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:17:23.304271');
INSERT INTO public.productos VALUES (52, 'PIN-009', 'Lija de pared N100', 'Lija de pared grano 100', 6, NULL, 0.80, 1.50, 'unidad', 100, 20, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306285/ferreteria-nasca/zekxaq1ucaf9epyhjsps.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:18:06.620279');
INSERT INTO public.productos VALUES (71, 'SEG-003', 'Lentes de seguridad', 'Lentes protección transparentes', 9, NULL, 4.00, 7.00, 'unidad', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306303/ferreteria-nasca/g6cj3jtkew6euswoiuso.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:18:24.75326');
INSERT INTO public.productos VALUES (36, 'ELE-005', 'Interruptor simple', 'Interruptor simple para empotrar', 5, NULL, 5.00, 8.00, 'unidad', 50, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306336/ferreteria-nasca/if2e3ynd0fojeqmz3uvv.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:18:57.271835');
INSERT INTO public.productos VALUES (70, 'SEG-002', 'Guantes de cuero', 'Guantes cuero trabajo pesado', 9, NULL, 8.00, 12.00, 'par', 30, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306372/ferreteria-nasca/rxgrkswx1d2tpex3wx5f.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:19:34.454052');
INSERT INTO public.productos VALUES (39, 'ELE-008', 'Foco LED 12W', 'Foco LED 12W luz blanca E27', 5, NULL, 7.00, 11.00, 'unidad', 80, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306422/ferreteria-nasca/qb5bcjenknmtygmqisd1.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:20:23.727905');
INSERT INTO public.productos VALUES (13, 'FIE-002', 'Fierro corrugado 3/8" x 9m', 'Varilla de fierro 9.5mm x 9 metros', 7, NULL, 22.00, 27.00, 'varilla', 150, 15, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306457/ferreteria-nasca/gbkchabqfvdwe3catut6.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:20:58.402421');
INSERT INTO public.productos VALUES (68, 'EHE-005', 'Broca concreto 8mm', 'Broca para concreto 8mm', 3, NULL, 4.00, 6.50, 'unidad', 30, 8, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781307021/ferreteria-nasca/gvrlzopc7hrwosrcftb5.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:30:22.634936');
INSERT INTO public.productos VALUES (14, 'FIE-003', 'Fierro corrugado 1/2" x 9m', 'Varilla de fierro 12mm x 9 metros', 7, NULL, 38.00, 45.00, 'varilla', 100, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306499/ferreteria-nasca/jkm1s6clzs3bfnzxa54o.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:21:40.08168');
INSERT INTO public.productos VALUES (75, 't5', 'drywall', '', 8, NULL, 455.00, 55.00, 'unidad', 78, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306584/ferreteria-nasca/rlmqnwi8s7kz8v9si8se.webp', true, true, true, '2026-05-07 18:10:20.113', '2026-06-12 18:23:05.391004');
INSERT INTO public.productos VALUES (66, 'EHE-003', 'Disco de corte 4.5"', 'Disco de corte metal 4.5"', 3, NULL, 3.50, 6.00, 'unidad', 50, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306607/ferreteria-nasca/mmc9mv2irutp6k7kejxz.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:23:28.78115');
INSERT INTO public.productos VALUES (25, 'PLO-006', 'Codo PVC 1/2" 90°', 'Codo PVC 1/2" a 90 grados', 4, NULL, 0.50, 1.00, 'unidad', 200, 20, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306652/ferreteria-nasca/cpkr00aog5srbha7uikw.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:24:13.891634');
INSERT INTO public.productos VALUES (18, 'FIE-007', 'Clavo 3" x kg', 'Clavos de acero 3 pulgadas, por kg', 7, NULL, 4.00, 6.00, 'kg', 79, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306708/ferreteria-nasca/dbq1vno5psa6mjdiyipg.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:25:10.687896');
INSERT INTO public.productos VALUES (40, 'ELE-009', 'Cinta aislante', 'Cinta aislante eléctrica negra', 5, NULL, 1.50, 2.50, 'unidad', 100, 15, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306773/ferreteria-nasca/jtep8sileibvinps60iv.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:26:14.569478');
INSERT INTO public.productos VALUES (5, 'CEM-001', 'Cemento Sol x 42.5 kg', 'Cemento Portland tipo I, bolsa de 42.5 kg', 1, NULL, 28.00, 32.50, 'bolsa', 100, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306813/ferreteria-nasca/y3rktulwg2kk0ky6mxqy.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:26:55.130531');
INSERT INTO public.productos VALUES (7, 'CEM-003', 'Cemento Andino x 42.5 kg', 'Cemento Portland tipo I marca Andino', 1, NULL, 26.50, 31.00, 'bolsa', 0, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306885/ferreteria-nasca/ydmzdvusqrv2uoy5kxki.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:28:06.910732');
INSERT INTO public.productos VALUES (33, 'ELE-002', 'Cable NYM 2x4mm metro', 'Cable NYM 2x4mm por metro', 5, NULL, 3.80, 5.00, 'metro', 300, 30, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781306940/ferreteria-nasca/sy5fbg6okmy89b4buhze.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:29:01.586116');
INSERT INTO public.productos VALUES (50, 'PIN-007', 'Brocha 3"', 'Brocha de cerda 3 pulgadas', 6, NULL, 5.00, 8.00, 'unidad', 40, 5, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781307004/ferreteria-nasca/abree81h54if58zo2wqm.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:30:05.369715');
INSERT INTO public.productos VALUES (67, 'EHE-004', 'Broca concreto 6mm', 'Broca para concreto 6mm', 3, NULL, 3.00, 5.00, 'unidad', 39, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781307060/ferreteria-nasca/bxtija0lx59i3puygppz.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:31:02.470279');
INSERT INTO public.productos VALUES (65, 'EHE-002', 'Amoladora 4.5" 750W', 'Amoladora angular 750W', 3, NULL, 90.00, 125.00, 'unidad', 1, 2, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781307139/ferreteria-nasca/z2ydfkqsfdnbyj44xwzc.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:32:21.457948');
INSERT INTO public.productos VALUES (16, 'FIE-005', 'Alambre negro N16 x kg', 'Alambre negro para amarre, por kg', 7, NULL, 3.50, 5.00, 'kg', 99, 10, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781307193/ferreteria-nasca/csrk9exaja1bvc5jqlxp.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:33:15.704958');
INSERT INTO public.productos VALUES (62, 'HER-009', 'Alicate universal 8"', 'Alicate universal 8 pulgadas', 2, NULL, 15.00, 22.00, 'unidad', 13, 3, 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781307158/ferreteria-nasca/o3xuxpak6kgjwzkxbcyw.webp', true, true, true, '2026-05-05 13:20:17.674304', '2026-06-12 18:33:18.463518');


--
-- Data for Name: carrito_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chatbot_sesiones; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chatbot_mensajes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.configuracion VALUES ('negocio_nombre', 'Ferretería Nasca', 'Nombre del negocio');
INSERT INTO public.configuracion VALUES ('negocio_telefono', '+51999888777', 'Teléfono principal');
INSERT INTO public.configuracion VALUES ('negocio_direccion', 'Jr. Lima 123, Nasca, Ica', 'Dirección física');
INSERT INTO public.configuracion VALUES ('negocio_horario', 'Lun-Sáb 8am-7pm', 'Horario de atención');
INSERT INTO public.configuracion VALUES ('yape_numero', '999888777', 'Número de Yape para pagos');
INSERT INTO public.configuracion VALUES ('yape_nombre', 'Ferretería Nasca', 'Nombre titular Yape');
INSERT INTO public.configuracion VALUES ('yape_qr_url', '', 'URL de imagen del QR de Yape');
INSERT INTO public.configuracion VALUES ('stock_alerta_email', 'admin@ferreteria.com', 'Email para alertas de stock bajo');
INSERT INTO public.configuracion VALUES ('bot_saludo', '¡Hola! Bienvenido a Ferretería Nasca 🔧 ¿En qué te puedo ayudar?', 'Mensaje de bienvenida del bot');


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios VALUES ('8b01555c-f45a-4833-8bae-bde31cd5677d', 'Admin', 'admin@ferreteria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', true, '2026-05-05 11:57:03.884889');


--
-- Data for Name: inventario_movimientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.inventario_movimientos VALUES (1, 1, 'entrada', 50, 0, 50, 'Stock inicial', '8b01555c-f45a-4833-8bae-bde31cd5677d', NULL, '2026-05-05 17:42:39.46');
INSERT INTO public.inventario_movimientos VALUES (2, 2, 'entrada', 30, 0, 30, 'Stock inicial', '8b01555c-f45a-4833-8bae-bde31cd5677d', NULL, '2026-05-05 17:43:05.005');
INSERT INTO public.inventario_movimientos VALUES (3, 3, 'entrada', 100, 0, 100, 'Stock inicial', '8b01555c-f45a-4833-8bae-bde31cd5677d', NULL, '2026-05-05 17:43:27.919');
INSERT INTO public.inventario_movimientos VALUES (4, 4, 'entrada', 40, 0, 40, 'Stock inicial', '8b01555c-f45a-4833-8bae-bde31cd5677d', NULL, '2026-05-05 17:43:51.752');
INSERT INTO public.inventario_movimientos VALUES (5, 2, 'salida', -1, 30, 29, 'Venta #1', NULL, NULL, '2026-05-05 17:45:00.153');
INSERT INTO public.inventario_movimientos VALUES (6, 3, 'salida', -1, 100, 99, 'Venta #2', NULL, NULL, '2026-05-05 17:52:21.914');
INSERT INTO public.inventario_movimientos VALUES (7, 32, 'salida', -1, 500, 499, 'Venta #3', NULL, NULL, '2026-05-06 00:08:10.795');
INSERT INTO public.inventario_movimientos VALUES (8, 65, 'salida', -1, 6, 5, 'Venta #4', NULL, NULL, '2026-05-06 00:10:46.203');
INSERT INTO public.inventario_movimientos VALUES (9, 65, 'salida', -1, 5, 4, 'Venta #5', NULL, NULL, '2026-05-06 00:45:37.576');
INSERT INTO public.inventario_movimientos VALUES (10, 18, 'salida', -1, 80, 79, 'Venta #6', NULL, NULL, '2026-05-06 00:53:02.887');
INSERT INTO public.inventario_movimientos VALUES (11, 7, 'salida', -1, 60, 59, 'Venta #7', NULL, NULL, '2026-05-06 00:54:15.712');
INSERT INTO public.inventario_movimientos VALUES (12, 65, 'salida', -1, 4, 3, 'Venta #8', NULL, NULL, '2026-05-07 18:02:23.71');
INSERT INTO public.inventario_movimientos VALUES (13, 7, 'salida', -58, 59, 1, 'Venta #9', NULL, NULL, '2026-05-07 18:08:47.059');
INSERT INTO public.inventario_movimientos VALUES (14, 75, 'entrada', 78, 0, 78, 'Stock inicial', '8b01555c-f45a-4833-8bae-bde31cd5677d', NULL, '2026-05-07 18:10:20.297');
INSERT INTO public.inventario_movimientos VALUES (15, 65, 'salida', -1, 3, 2, 'Venta #10', NULL, NULL, '2026-05-08 14:45:13.738');
INSERT INTO public.inventario_movimientos VALUES (16, 62, 'salida', -1, 15, 14, 'Venta #11', NULL, NULL, '2026-05-11 22:19:42.914');
INSERT INTO public.inventario_movimientos VALUES (17, 53, 'salida', -1, 40, 39, 'Venta #12', NULL, NULL, '2026-05-16 16:39:52.12');
INSERT INTO public.inventario_movimientos VALUES (18, 67, 'salida', -1, 40, 39, 'Venta #13', NULL, NULL, '2026-05-16 17:23:50.512');
INSERT INTO public.inventario_movimientos VALUES (19, 62, 'salida', -1, 14, 13, 'Venta #14', NULL, NULL, '2026-05-16 17:25:37.714');
INSERT INTO public.inventario_movimientos VALUES (20, 7, 'salida', -1, 1, 0, 'Venta #15', NULL, NULL, '2026-06-07 06:37:20.564');
INSERT INTO public.inventario_movimientos VALUES (21, 47, 'salida', -1, 20, 19, 'Venta #16', NULL, NULL, '2026-06-12 00:28:05.878');
INSERT INTO public.inventario_movimientos VALUES (22, 16, 'salida', -1, 100, 99, 'Venta #17', NULL, NULL, '2026-06-12 00:29:18.055');
INSERT INTO public.inventario_movimientos VALUES (23, 65, 'salida', -1, 2, 1, 'Venta #18', NULL, NULL, '2026-06-12 04:01:26.528');


--
-- Data for Name: producto_imagenes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: ventas; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ventas VALUES ('4c578107-4119-4026-8326-f895b3ea668c', 1, NULL, NULL, 'presencial', 'pendiente', 40.00, 0.00, 40.00, 'yape', NULL, NULL, '2026-05-05 17:45:00.12', '2026-05-05 17:45:00.12');
INSERT INTO public.ventas VALUES ('f52d89d2-5015-4338-9eb9-e6c52e74161e', 2, NULL, NULL, 'web', 'pagado', 2.00, 0.00, 2.00, 'yape', NULL, 'Cliente: Sebas | Tel: 935274265', '2026-05-05 17:52:21.894', '2026-05-05 19:07:38.512557');
INSERT INTO public.ventas VALUES ('1774d685-2598-4a6a-a69e-ba1e3d91f70d', 3, NULL, NULL, 'web', 'pendiente', 3.50, 0.00, 3.50, 'yape', NULL, 'Cliente: sebastian | Tel: 95648815', '2026-05-06 00:08:10.776', '2026-05-06 00:08:10.776');
INSERT INTO public.ventas VALUES ('73d47933-7a78-471d-ba53-3a1a72b2bc3e', 4, NULL, NULL, 'web', 'pendiente', 125.00, 0.00, 125.00, 'yape', NULL, 'Cliente: cbas | Tel: 935245789', '2026-05-06 00:10:46.168', '2026-05-06 00:10:46.168');
INSERT INTO public.ventas VALUES ('0ebd1b1c-8e98-4c39-a31f-0c69d9c40b11', 5, '836a8566-2b91-47ec-8d22-4cd1b5f73841', NULL, 'web', 'pendiente', 125.00, 0.00, 125.00, 'yape', 'comprobante_enviado_por_cliente', 'Cliente: AntonioCpp | Tel: 946613245', '2026-05-06 00:45:37.548', '2026-05-05 19:45:42.159556');
INSERT INTO public.ventas VALUES ('9126666c-594a-41dc-b554-06933f41430e', 6, '836a8566-2b91-47ec-8d22-4cd1b5f73841', NULL, 'web', 'despachado', 6.00, 0.00, 6.00, 'yape', 'comprobante_enviado_por_cliente', 'Cliente: AntonioCpp | Tel: 946613245', '2026-05-06 00:53:02.854', '2026-05-05 19:53:41.879987');
INSERT INTO public.ventas VALUES ('4b8beca6-3eac-41ff-922f-770f610c93af', 7, NULL, NULL, 'presencial', 'pendiente', 31.00, 0.00, 31.00, 'yape', NULL, NULL, '2026-05-06 00:54:15.692', '2026-05-06 00:54:15.692');
INSERT INTO public.ventas VALUES ('72a03c15-e429-46b8-b7dd-5d5bdea6b7f9', 8, '836a8566-2b91-47ec-8d22-4cd1b5f73841', NULL, 'web', 'despachado', 125.00, 0.00, 125.00, 'yape', 'comprobante_enviado_por_cliente', 'Cliente: AntonioCpp | Tel: 946613245', '2026-05-07 18:02:23.649', '2026-05-07 13:03:28.862758');
INSERT INTO public.ventas VALUES ('6b4068b2-c55d-4c82-80fc-24b273860037', 10, '836a8566-2b91-47ec-8d22-4cd1b5f73841', NULL, 'web', 'pagado', 125.00, 0.00, 125.00, 'yape', 'comprobante_enviado_por_cliente', 'Cliente: AntonioCpp | Tel: 946613245', '2026-05-08 14:45:13.677', '2026-05-08 09:46:59.926416');
INSERT INTO public.ventas VALUES ('8cdf9e9b-f92e-48cc-af7b-f96eb4aa0648', 9, NULL, NULL, 'presencial', 'pagado', 1798.00, 0.00, 1798.00, 'yape', NULL, NULL, '2026-05-07 18:08:47.031', '2026-05-08 09:47:27.661769');
INSERT INTO public.ventas VALUES ('4da2c2d7-60ca-4f43-bf84-a28998da1fab', 11, '836a8566-2b91-47ec-8d22-4cd1b5f73841', NULL, 'web', 'pendiente', 22.00, 0.00, 22.00, 'yape', NULL, 'Cliente: AntonioCpp | Tel: 946613245', '2026-05-11 22:19:42.223', '2026-05-11 22:19:42.223');
INSERT INTO public.ventas VALUES ('60dbfe8e-be5b-47c0-9a77-a1641c2abfa2', 12, NULL, NULL, 'presencial', 'pendiente', 8.00, 0.00, 8.00, 'yape', NULL, NULL, '2026-05-16 16:39:50.804', '2026-05-16 16:39:50.804');
INSERT INTO public.ventas VALUES ('4b2fc452-c52f-466b-b92d-c095a655ed79', 13, NULL, NULL, 'presencial', 'pagado', 5.00, 0.00, 5.00, 'efectivo', NULL, NULL, '2026-05-16 17:23:50.479', '2026-05-16 12:24:12.508713');
INSERT INTO public.ventas VALUES ('4b4f2643-2bb2-4e94-8ed8-6bf2c74a9983', 14, '836a8566-2b91-47ec-8d22-4cd1b5f73841', NULL, 'web', 'pagado', 22.00, 0.00, 22.00, 'yape', 'comprobante_enviado_por_cliente', 'Cliente: AntonioCpp | Tel: 946613245', '2026-05-16 17:25:37.694', '2026-05-16 12:27:35.540541');
INSERT INTO public.ventas VALUES ('907936c2-213e-481b-b705-84a1ed9ed633', 15, NULL, NULL, 'presencial', 'pendiente', 31.00, 0.00, 31.00, 'yape', NULL, NULL, '2026-06-07 06:37:19.733', '2026-06-07 06:37:19.733');
INSERT INTO public.ventas VALUES ('5b034306-7a31-4ba6-9a44-bfe27960518f', 16, NULL, NULL, 'presencial', 'pendiente', 55.00, 0.00, 55.00, 'efectivo', NULL, NULL, '2026-06-12 00:28:04.664', '2026-06-12 00:28:04.664');
INSERT INTO public.ventas VALUES ('c33a107c-91df-4438-8460-b2841de1f54c', 17, 'd7a9cffb-a40c-450c-8d16-4a544e6cb104', NULL, 'web', 'pendiente', 5.00, 0.00, 5.00, 'yape', 'enviado_por_cliente', 'Cliente: Sebastian Simon | Tel: 956845684', '2026-06-12 00:29:18.039', '2026-06-11 19:29:27.882052');
INSERT INTO public.ventas VALUES ('c32eb28f-a39f-474c-aa06-71519f388ce4', 18, 'd7a9cffb-a40c-450c-8d16-4a544e6cb104', NULL, 'web', 'pendiente', 125.00, 0.00, 125.00, 'yape', 'https://res.cloudinary.com/detjy6mbw/image/upload/v1781236891/ferreteria-nasca/comprobantes/bfgn3gayvjyozlwo6xgj.webp', 'Cliente: Sebastian Simon | Tel: 956845684', '2026-06-12 04:01:26.485', '2026-06-11 23:01:33.403262');


--
-- Data for Name: venta_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.venta_items VALUES (1, '4c578107-4119-4026-8326-f895b3ea668c', 2, 'Cemento Yura', 40.00, 1, 40.00);
INSERT INTO public.venta_items VALUES (2, 'f52d89d2-5015-4338-9eb9-e6c52e74161e', 3, 'Fierro 3 Pulgadas', 2.00, 1, 2.00);
INSERT INTO public.venta_items VALUES (3, '1774d685-2598-4a6a-a69e-ba1e3d91f70d', 32, 'Cable NYM 2x2.5mm metro', 3.50, 1, 3.50);
INSERT INTO public.venta_items VALUES (4, '73d47933-7a78-471d-ba53-3a1a72b2bc3e', 65, 'Amoladora 4.5" 750W', 125.00, 1, 125.00);
INSERT INTO public.venta_items VALUES (5, '0ebd1b1c-8e98-4c39-a31f-0c69d9c40b11', 65, 'Amoladora 4.5" 750W', 125.00, 1, 125.00);
INSERT INTO public.venta_items VALUES (6, '9126666c-594a-41dc-b554-06933f41430e', 18, 'Clavo 3" x kg', 6.00, 1, 6.00);
INSERT INTO public.venta_items VALUES (7, '4b8beca6-3eac-41ff-922f-770f610c93af', 7, 'Cemento Andino x 42.5 kg', 31.00, 1, 31.00);
INSERT INTO public.venta_items VALUES (8, '72a03c15-e429-46b8-b7dd-5d5bdea6b7f9', 65, 'Amoladora 4.5" 750W', 125.00, 1, 125.00);
INSERT INTO public.venta_items VALUES (9, '8cdf9e9b-f92e-48cc-af7b-f96eb4aa0648', 7, 'Cemento Andino x 42.5 kg', 31.00, 58, 1798.00);
INSERT INTO public.venta_items VALUES (10, '6b4068b2-c55d-4c82-80fc-24b273860037', 65, 'Amoladora 4.5" 750W', 125.00, 1, 125.00);
INSERT INTO public.venta_items VALUES (11, '4da2c2d7-60ca-4f43-bf84-a28998da1fab', 62, 'Alicate universal 8"', 22.00, 1, 22.00);
INSERT INTO public.venta_items VALUES (12, '60dbfe8e-be5b-47c0-9a77-a1641c2abfa2', 53, 'Thinner acrilico x litro', 8.00, 1, 8.00);
INSERT INTO public.venta_items VALUES (13, '4b2fc452-c52f-466b-b92d-c095a655ed79', 67, 'Broca concreto 6mm', 5.00, 1, 5.00);
INSERT INTO public.venta_items VALUES (14, '4b4f2643-2bb2-4e94-8ed8-6bf2c74a9983', 62, 'Alicate universal 8"', 22.00, 1, 22.00);
INSERT INTO public.venta_items VALUES (15, '907936c2-213e-481b-b705-84a1ed9ed633', 7, 'Cemento Andino x 42.5 kg', 31.00, 1, 31.00);
INSERT INTO public.venta_items VALUES (16, '5b034306-7a31-4ba6-9a44-bfe27960518f', 47, 'Pintura anticorrosiva x gl', 55.00, 1, 55.00);
INSERT INTO public.venta_items VALUES (17, 'c33a107c-91df-4438-8460-b2841de1f54c', 16, 'Alambre negro N16 x kg', 5.00, 1, 5.00);
INSERT INTO public.venta_items VALUES (18, 'c32eb28f-a39f-474c-aa06-71519f388ce4', 65, 'Amoladora 4.5" 750W', 125.00, 1, 125.00);


--
-- Name: carrito_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carrito_items_id_seq', 1, false);


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 10, true);


--
-- Name: chatbot_mensajes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chatbot_mensajes_id_seq', 1, false);


--
-- Name: inventario_movimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventario_movimientos_id_seq', 23, true);


--
-- Name: producto_imagenes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_imagenes_id_seq', 1, false);


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_seq', 75, true);


--
-- Name: proveedores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proveedores_id_seq', 1, false);


--
-- Name: venta_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.venta_items_id_seq', 18, true);


--
-- Name: ventas_numero_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ventas_numero_seq', 18, true);


--
-- PostgreSQL database dump complete
--

\unrestrict PPh4pLBKdjX3Nh8OCl8ugYTnuXr9MsueLTmMIuSkU3QzQnmoluhKynwPE2VVuXe

