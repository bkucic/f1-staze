--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2024-10-27 11:43:12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 17212)
-- Name: odrzana_na; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.odrzana_na (
    staza_id integer NOT NULL,
    vn_id integer NOT NULL
);


ALTER TABLE public.odrzana_na OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 17195)
-- Name: staza; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staza (
    staza_id integer NOT NULL,
    staza_naziv text NOT NULL,
    geografska_sirina real NOT NULL,
    geografska_duzina real NOT NULL,
    podrucje text NOT NULL,
    drzava text NOT NULL,
    tip text NOT NULL,
    duljina_km real NOT NULL,
    broj_zavoja integer NOT NULL,
    smjer text NOT NULL
);


ALTER TABLE public.staza OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 17194)
-- Name: staza_stazaid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staza_stazaid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staza_stazaid_seq OWNER TO postgres;

--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 215
-- Name: staza_stazaid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staza_stazaid_seq OWNED BY public.staza.staza_id;


--
-- TOC entry 218 (class 1259 OID 17204)
-- Name: velika_nagrada; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.velika_nagrada (
    vn_id integer NOT NULL,
    vn_naziv text NOT NULL,
    broj_odrzavanja integer NOT NULL
);


ALTER TABLE public.velika_nagrada OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17203)
-- Name: velikanagrada_vnid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.velikanagrada_vnid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.velikanagrada_vnid_seq OWNER TO postgres;

--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 217
-- Name: velikanagrada_vnid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.velikanagrada_vnid_seq OWNED BY public.velika_nagrada.vn_id;


--
-- TOC entry 4697 (class 2604 OID 17198)
-- Name: staza staza_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staza ALTER COLUMN staza_id SET DEFAULT nextval('public.staza_stazaid_seq'::regclass);


--
-- TOC entry 4698 (class 2604 OID 17207)
-- Name: velika_nagrada vn_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.velika_nagrada ALTER COLUMN vn_id SET DEFAULT nextval('public.velikanagrada_vnid_seq'::regclass);


--
-- TOC entry 4854 (class 0 OID 17212)
-- Dependencies: 219
-- Data for Name: odrzana_na; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.odrzana_na (staza_id, vn_id) FROM stdin;
1	1
2	2
3	3
4	4
5	3
6	5
7	6
8	7
9	8
10	9
11	10
12	11
13	12
14	13
15	14
16	15
17	16
18	17
19	18
20	19
21	20
22	21
23	22
24	23
3	29
3	30
6	27
7	26
20	25
22	24
\.


--
-- TOC entry 4851 (class 0 OID 17195)
-- Dependencies: 216
-- Data for Name: staza; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staza (staza_id, staza_naziv, geografska_sirina, geografska_duzina, podrucje, drzava, tip, duljina_km, broj_zavoja, smjer) FROM stdin;
1	Albert Park Circuit	-37.849724	144.96834	Melbourne	Australija	ulična	5.278	16	u smjeru kazaljke na satu
2	Autódromo Hermanos Rodríguez	19.40611	-99.0925	Ciudad de México	Meksiko	stalna	4.304	17	u smjeru kazaljke na satu
3	Autodromo Internazionale Enzo e Dino Ferrari	44.34111	11.713333	Imola	Italija	stalna	4.909	17	suprotno smjeru kazaljke na satu
4	Autodromo José Carlos Pace	-23.70111	-46.697224	São Paulo	Brazil	stalna	4.309	15	suprotno smjeru kazaljke na satu
5	Autodromo Nazionale di Monza	45.620556	9.289444	Monza	Italija	stalna	5.793	11	u smjeru kazaljke na satu
6	Bahrain International Circuit	26.0325	50.510555	Sakhir	Bahrein	stalna	5.412	15	u smjeru kazaljke na satu
7	Baku City Circuit	40.3725	49.853333	Baku	Azerbajdžan	ulična	6.003	20	suprotno smjeru kazaljke na satu
8	Circuit de Barcelona-Catalunya	41.57	2.261111	Montmeló	Španjolska	stalna	4.657	14	u smjeru kazaljke na satu
9	Circuit de Monaco	43.734722	7.420556	Monte Carlo	Monako	ulična	3.337	19	u smjeru kazaljke na satu
10	Circuit de Spa-Francorchamps	50.43722	5.971389	Stavelot	Belgija	stalna	7.004	20	u smjeru kazaljke na satu
11	Circuit Gilles-Villeneuve	45.500557	-73.5225	Montreal	Kanada	ulična	4.361	13	u smjeru kazaljke na satu
12	Circuit of the Americas	30.132778	-97.64111	Austin	SAD	stalna	5.513	20	suprotno smjeru kazaljke na satu
13	Circuit Zandvoort	52.38889	4.540833	Zandvoort	Nizozemska	stalna	4.259	14	u smjeru kazaljke na satu
14	Hungaroring	47.582222	19.25111	Mogyoród	Mađarska	stalna	4.381	14	u smjeru kazaljke na satu
15	Jeddah Corniche Circuit	21.631945	39.104443	Jeddah	Saudijska Arabija	ulična	6.174	27	suprotno smjeru kazaljke na satu
16	Las Vegas Strip Circuit	36.10995	-115.16217	Paradise	SAD	ulična	6.201	17	suprotno smjeru kazaljke na satu
17	Lusail International Circuit	25.49	51.454166	Lusail	Katar	stalna	5.419	16	u smjeru kazaljke na satu
18	Marina Bay Street Circuit	1.291531	103.86385	Marina Bay	Singapur	ulična	4.94	19	suprotno smjeru kazaljke na satu
19	Miami International Autodrome	25.958055	-80.23889	Miami Gardens	SAD	ulična	5.412	18	suprotno smjeru kazaljke na satu
20	Red Bull Ring	47.219723	14.764722	Spielberg	Austrija	stalna	4.318	10	u smjeru kazaljke na satu
21	Shanghai International Circuit	31.338888	121.21972	Shanghai	Kina	stalna	5.451	16	u smjeru kazaljke na satu
22	Silverstone Circuit	52.071	-1.016	Silverstone	Ujedinjeno Kraljevstvo	stalna	5.891	18	u smjeru kazaljke na satu
23	Suzuka International Racing Course	34.8417	136.5389	Suzuka	Japan	stalna	5.807	18	dvosmjerna
24	Yas Marina Circuit	24.467222	54.603058	Abu Dhabi	UAE	stalna	5.281	15	suprotno smjeru kazaljke na satu
\.


--
-- TOC entry 4853 (class 0 OID 17204)
-- Dependencies: 218
-- Data for Name: velika_nagrada; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.velika_nagrada (vn_id, vn_naziv, broj_odrzavanja) FROM stdin;
1	Australian Grand Prix	87
2	Mexican Grand Prix	24
3	Italian Grand Prix	94
4	Brazilian Grand Prix	51
5	Bahrain Grand Prix	20
6	Azerbaijan Grand Prix	7
7	Spanish Grand Prix	65
8	Monaco Grand Prix	81
9	Belgian Grand Prix	80
10	Canadian Grand Prix	59
11	United States Grand Prix	53
12	Dutch Grand Prix	36
13	Hungarian Grand Prix	40
14	Saudi Arabian Grand Prix	4
15	Las Vegas Grand Prix	1
16	Qatar Grand Prix	2
17	Singapore Grand Prix	23
18	Miami Grand Prix	3
19	Austrian Grand Prix	43
20	Chinese Grand Prix	17
21	British Grand Prix	79
22	Japanese Grand Prix	49
23	Abu Dhabi Grand Prix	15
24	70th Anniversary Grand Prix	1
25	Styrian Grand Prix	2
26	European Grand Prix	23
27	Sakhir Grand Prix	1
29	Emilia Romagna Grand Prix	4
30	San Marino Grand Prix	26
\.


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 215
-- Name: staza_stazaid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staza_stazaid_seq', 24, true);


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 217
-- Name: velikanagrada_vnid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.velikanagrada_vnid_seq', 30, true);


--
-- TOC entry 4704 (class 2606 OID 17216)
-- Name: odrzana_na odrzanana_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odrzana_na
    ADD CONSTRAINT odrzanana_pkey PRIMARY KEY (staza_id, vn_id);


--
-- TOC entry 4700 (class 2606 OID 17202)
-- Name: staza staza_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staza
    ADD CONSTRAINT staza_pkey PRIMARY KEY (staza_id);


--
-- TOC entry 4702 (class 2606 OID 17211)
-- Name: velika_nagrada velikanagrada_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.velika_nagrada
    ADD CONSTRAINT velikanagrada_pkey PRIMARY KEY (vn_id);


--
-- TOC entry 4705 (class 2606 OID 17217)
-- Name: odrzana_na odrzanana_stazaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odrzana_na
    ADD CONSTRAINT odrzanana_stazaid_fkey FOREIGN KEY (staza_id) REFERENCES public.staza(staza_id);


--
-- TOC entry 4706 (class 2606 OID 17222)
-- Name: odrzana_na odrzanana_vnid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.odrzana_na
    ADD CONSTRAINT odrzanana_vnid_fkey FOREIGN KEY (vn_id) REFERENCES public.velika_nagrada(vn_id);


-- Completed on 2024-10-27 11:43:12

--
-- PostgreSQL database dump complete
--

