/*
 * Teens Connect Africa
 * Africa Location Dataset
 *
 * Country -> State / Region / Province -> Local Area
 *
 * The location dataset stays inside the application.
 * Only the member's selected location should be saved to Supabase.
 */

export type AfricaLocationData = Record<
  string,
  Record<string, string[]>
>;

export const AFRICA_LOCATIONS: AfricaLocationData = {
  Nigeria: {
    Abia: [
      "Aba North",
      "Aba South",
      "Arochukwu",
      "Bende",
      "Ikwuano",
      "Isiala Ngwa North",
      "Isiala Ngwa South",
      "Isuikwuato",
      "Obi Ngwa",
      "Ohafia",
      "Osisioma Ngwa",
      "Ugwunagbo",
      "Ukwa East",
      "Ukwa West",
      "Umuahia North",
      "Umuahia South",
      "Umunneochi",
    ],

    Adamawa: [
      "Demsa",
      "Fufore",
      "Ganye",
      "Girei",
      "Gombi",
      "Guyuk",
      "Hong",
      "Jada",
      "Lamurde",
      "Madagali",
      "Maiha",
      "Mayo-Belwa",
      "Michika",
      "Mubi North",
      "Mubi South",
      "Numan",
      "Shelleng",
      "Song",
      "Toungo",
      "Yola North",
      "Yola South",
    ],

    "Akwa Ibom": [
      "Abak",
      "Eastern Obolo",
      "Eket",
      "Esit Eket",
      "Essien Udim",
      "Etim Ekpo",
      "Etinan",
      "Ibeno",
      "Ibesikpo Asutan",
      "Ibiono Ibom",
      "Ika",
      "Ikono",
      "Ikot Abasi",
      "Ikot Ekpene",
      "Ini",
      "Itu",
      "Mbo",
      "Mkpat Enin",
      "Nsit Atai",
      "Nsit Ibom",
      "Nsit Ubium",
      "Obot Akara",
      "Okobo",
      "Onna",
      "Oron",
      "Oruk Anam",
      "Udung Uko",
      "Ukanafun",
      "Uruan",
      "Urue-Offong/Oruko",
      "Uyo",
    ],

    Anambra: [
      "Aguata",
      "Anambra East",
      "Anambra West",
      "Anaocha",
      "Awka North",
      "Awka South",
      "Ayamelum",
      "Dunukofia",
      "Ekwusigo",
      "Idemili North",
      "Idemili South",
      "Ihiala",
      "Njikoka",
      "Nnewi North",
      "Nnewi South",
      "Ogbaru",
      "Onitsha North",
      "Onitsha South",
      "Orumba North",
      "Orumba South",
      "Oyi",
    ],

    Bauchi: [
      "Bauchi",
      "Bogoro",
      "Damban",
      "Darazo",
      "Dass",
      "Gamawa",
      "Ganjuwa",
      "Giade",
      "Itas/Gadau",
      "Jama'are",
      "Katagum",
      "Kirfi",
      "Misau",
      "Ningi",
      "Shira",
      "Tafawa Balewa",
      "Toro",
      "Warji",
      "Zaki",
    ],

    Bayelsa: [
      "Brass",
      "Ekeremor",
      "Kolokuma/Opokuma",
      "Nembe",
      "Ogbia",
      "Sagbama",
      "Southern Ijaw",
      "Yenagoa",
    ],

    Benue: [
      "Ado",
      "Agatu",
      "Apa",
      "Buruku",
      "Gboko",
      "Guma",
      "Gwer East",
      "Gwer West",
      "Katsina-Ala",
      "Konshisha",
      "Kwande",
      "Logo",
      "Makurdi",
      "Obi",
      "Ogbadibo",
      "Ohimini",
      "Oju",
      "Okpokwu",
      "Oturkpo",
      "Tarka",
      "Ukum",
      "Ushongo",
      "Vandeikya",
    ],

    Borno: [
      "Abadam",
      "Askira/Uba",
      "Bama",
      "Bayo",
      "Biu",
      "Chibok",
      "Damboa",
      "Dikwa",
      "Gubio",
      "Guzamala",
      "Gwoza",
      "Hawul",
      "Jere",
      "Kaga",
      "Kala/Balge",
      "Konduga",
      "Kukawa",
      "Kwaya Kusar",
      "Mafa",
      "Magumeri",
      "Maiduguri",
      "Marte",
      "Mobbar",
      "Monguno",
      "Ngala",
      "Nganzai",
      "Shani",
    ],

    "Cross River": [
      "Abi",
      "Akamkpa",
      "Akpabuyo",
      "Bakassi",
      "Bekwarra",
      "Biase",
      "Boki",
      "Calabar Municipal",
      "Calabar South",
      "Etung",
      "Ikom",
      "Obanliku",
      "Obubra",
      "Obudu",
      "Odukpani",
      "Ogoja",
      "Yakuur",
      "Yala",
    ],

    Delta: [
      "Aniocha North",
      "Aniocha South",
      "Bomadi",
      "Burutu",
      "Ethiope East",
      "Ethiope West",
      "Ika North East",
      "Ika South",
      "Isoko North",
      "Isoko South",
      "Ndokwa East",
      "Ndokwa West",
      "Okpe",
      "Oshimili North",
      "Oshimili South",
      "Patani",
      "Sapele",
      "Udu",
      "Ughelli North",
      "Ughelli South",
      "Ukwuani",
      "Uvwie",
      "Warri North",
      "Warri South",
      "Warri South West",
    ],

    Ebonyi: [
      "Abakaliki",
      "Afikpo North",
      "Afikpo South",
      "Ebonyi",
      "Ezza North",
      "Ezza South",
      "Ikwo",
      "Ishielu",
      "Ivo",
      "Izzi",
      "Ohaukwu",
      "Onicha",
    ],

    Edo: [
      "Akoko-Edo",
      "Egor",
      "Esan Central",
      "Esan North-East",
      "Esan South-East",
      "Esan West",
      "Etsako Central",
      "Etsako East",
      "Etsako West",
      "Igueben",
      "Ikpoba-Okha",
      "Oredo",
      "Orhionmwon",
      "Ovia North-East",
      "Ovia South-West",
      "Owan East",
      "Owan West",
      "Uhunmwonde",
    ],

    Ekiti: [
      "Ado Ekiti",
      "Efon",
      "Ekiti East",
      "Ekiti South-West",
      "Ekiti West",
      "Emure",
      "Gbonyin",
      "Ido-Osi",
      "Ijero",
      "Ikere",
      "Ikole",
      "Ilejemeje",
      "Irepodun/Ifelodun",
      "Ise/Orun",
      "Moba",
      "Oye",
    ],

    Enugu: [
      "Aninri",
      "Awgu",
      "Enugu East",
      "Enugu North",
      "Enugu South",
      "Ezeagu",
      "Igbo Etiti",
      "Igbo Eze North",
      "Igbo Eze South",
      "Isi-Uzo",
      "Nkanu East",
      "Nkanu West",
      "Nsukka",
      "Oji River",
      "Udenu",
      "Udi",
      "Uzo-Uwani",
    ],

    Gombe: [
      "Akko",
      "Balanga",
      "Billiri",
      "Dukku",
      "Funakaye",
      "Gombe",
      "Kaltungo",
      "Kwami",
      "Nafada",
      "Shongom",
      "Yamaltu/Deba",
    ],

    Imo: [
      "Ahiazu Mbaise",
      "Ehime Mbano",
      "Ezinihitte",
      "Ideato North",
      "Ideato South",
      "Ihitte/Uboma",
      "Ikeduru",
      "Isiala Mbano",
      "Isu",
      "Mbaitoli",
      "Ngor Okpala",
      "Njaba",
      "Nkwerre",
      "Nwangele",
      "Obowo",
      "Oguta",
      "Ohaji/Egbema",
      "Okigwe",
      "Orlu",
      "Orsu",
      "Oru East",
      "Oru West",
      "Owerri Municipal",
      "Owerri North",
      "Owerri West",
      "Unuimo",
    ],

    Jigawa: [
      "Auyo",
      "Babura",
      "Biriniwa",
      "Birnin Kudu",
      "Buji",
      "Dutse",
      "Gagarawa",
      "Garki",
      "Gumel",
      "Guri",
      "Gwaram",
      "Gwiwa",
      "Hadejia",
      "Jahun",
      "Kafin Hausa",
      "Kaugama",
      "Kazaure",
      "Kiri Kasama",
      "Kiyawa",
      "Maigatari",
      "Malam Madori",
      "Miga",
      "Ringim",
      "Roni",
      "Sule Tankarkar",
      "Taura",
      "Yankwashi",
    ],

    Kaduna: [
      "Birnin Gwari",
      "Chikun",
      "Giwa",
      "Igabi",
      "Ikara",
      "Jaba",
      "Jema'a",
      "Kachia",
      "Kaduna North",
      "Kaduna South",
      "Kagarko",
      "Kajuru",
      "Kaura",
      "Kauru",
      "Kubau",
      "Kudan",
      "Lere",
      "Makarfi",
      "Sabon Gari",
      "Sanga",
      "Soba",
      "Zangon Kataf",
      "Zaria",
    ],

    Kano: [
      "Ajingi",
      "Albasu",
      "Bagwai",
      "Bebeji",
      "Bichi",
      "Bunkure",
      "Dala",
      "Dambatta",
      "Dawakin Kudu",
      "Dawakin Tofa",
      "Doguwa",
      "Fagge",
      "Gabasawa",
      "Garko",
      "Garun Mallam",
      "Gaya",
      "Gezawa",
      "Gwale",
      "Gwarzo",
      "Kabo",
      "Kano Municipal",
      "Karaye",
      "Kibiya",
      "Kiru",
      "Kumbotso",
      "Kunchi",
      "Kura",
      "Madobi",
      "Makoda",
      "Minjibir",
      "Nasarawa",
      "Rano",
      "Rimin Gado",
      "Rogo",
      "Shanono",
      "Sumaila",
      "Takai",
      "Tarauni",
      "Tofa",
      "Tsanyawa",
      "Tudun Wada",
      "Ungogo",
      "Warawa",
      "Wudil",
    ],

    Katsina: [
      "Bakori",
      "Batagarawa",
      "Batsari",
      "Baure",
      "Bindawa",
      "Charanchi",
      "Dan Musa",
      "Dandume",
      "Danja",
      "Daura",
      "Dutsi",
      "Dutsin-Ma",
      "Faskari",
      "Funtua",
      "Ingawa",
      "Jibia",
      "Kafur",
      "Kaita",
      "Kankara",
      "Kankia",
      "Katsina",
      "Kurfi",
      "Kusada",
      "Mai'Adua",
      "Malumfashi",
      "Mani",
      "Matazu",
      "Musawa",
      "Rimi",
      "Sabuwa",
      "Safana",
      "Sandamu",
      "Zango",
    ],

    Kebbi: [
      "Aleiro",
      "Arewa Dandi",
      "Argungu",
      "Augie",
      "Bagudo",
      "Birnin Kebbi",
      "Bunza",
      "Dandi",
      "Fakai",
      "Gwandu",
      "Jega",
      "Kalgo",
      "Koko/Besse",
      "Maiyama",
      "Ngaski",
      "Sakaba",
      "Shanga",
      "Suru",
      "Wasagu/Danko",
      "Yauri",
      "Zuru",
    ],

    Kogi: [
      "Adavi",
      "Ajaokuta",
      "Ankpa",
      "Bassa",
      "Dekina",
      "Ibaji",
      "Idah",
      "Igalamela-Odolu",
      "Ijumu",
      "Kabba/Bunu",
      "Kogi",
      "Lokoja",
      "Mopa-Muro",
      "Ofu",
      "Ogori/Magongo",
      "Okehi",
      "Okene",
      "Olamaboro",
      "Omala",
      "Yagba East",
      "Yagba West",
    ],

    Kwara: [
      "Asa",
      "Baruten",
      "Edu",
      "Ekiti",
      "Ifelodun",
      "Ilorin East",
      "Ilorin South",
      "Ilorin West",
      "Irepodun",
      "Isin",
      "Kaiama",
      "Moro",
      "Offa",
      "Oke Ero",
      "Oyun",
      "Pategi",
    ],

    Lagos: [
      "Agege",
      "Ajeromi-Ifelodun",
      "Alimosho",
      "Amuwo-Odofin",
      "Apapa",
      "Badagry",
      "Epe",
      "Eti-Osa",
      "Ibeju-Lekki",
      "Ifako-Ijaiye",
      "Ikeja",
      "Ikorodu",
      "Kosofe",
      "Lagos Island",
      "Lagos Mainland",
      "Mushin",
      "Ojo",
      "Oshodi-Isolo",
      "Shomolu",
      "Surulere",
    ],

    Nasarawa: [
      "Akwanga",
      "Awe",
      "Doma",
      "Karu",
      "Keana",
      "Keffi",
      "Kokona",
      "Lafia",
      "Nasarawa",
      "Nasarawa Eggon",
      "Obi",
      "Toto",
      "Wamba",
    ],

    Niger: [
      "Agaie",
      "Agwara",
      "Bida",
      "Borgu",
      "Bosso",
      "Chanchaga",
      "Edati",
      "Gbako",
      "Gurara",
      "Katcha",
      "Kontagora",
      "Lapai",
      "Lavun",
      "Magama",
      "Mariga",
      "Mashegu",
      "Mokwa",
      "Munya",
      "Paikoro",
      "Rafi",
      "Rijau",
      "Shiroro",
      "Suleja",
      "Tafa",
      "Wushishi",
    ],

    Ogun: [
      "Abeokuta North",
      "Abeokuta South",
      "Ado-Odo/Ota",
      "Ewekoro",
      "Ifo",
      "Ijebu East",
      "Ijebu North",
      "Ijebu North East",
      "Ijebu Ode",
      "Ikenne",
      "Imeko Afon",
      "Ipokia",
      "Obafemi Owode",
      "Odeda",
      "Odogbolu",
      "Ogun Waterside",
      "Remo North",
      "Sagamu",
    ],

    Ondo: [
      "Akoko North-East",
      "Akoko North-West",
      "Akoko South-East",
      "Akoko South-West",
      "Akure North",
      "Akure South",
      "Ese Odo",
      "Idanre",
      "Ifedore",
      "Ilaje",
      "Ile Oluji/Okeigbo",
      "Irele",
      "Odigbo",
      "Okitipupa",
      "Ondo East",
      "Ondo West",
      "Ose",
      "Owo",
    ],

    Osun: [
      "Atakunmosa East",
      "Atakunmosa West",
      "Ayedaade",
      "Ayedire",
      "Boluwaduro",
      "Boripe",
      "Ede North",
      "Ede South",
      "Egbedore",
      "Ejigbo",
      "Ife Central",
      "Ife East",
      "Ife North",
      "Ife South",
      "Ifedayo",
      "Ila",
      "Ilesa East",
      "Ilesa West",
      "Irepodun",
      "Irewole",
      "Isokan",
      "Iwo",
      "Obokun",
      "Odo Otin",
      "Ola Oluwa",
      "Olorunda",
      "Oriade",
      "Orioluwa",
      "Osogbo",
    ],

    Oyo: [
      "Afijio",
      "Akinyele",
      "Atiba",
      "Atisbo",
      "Egbeda",
      "Ibadan North",
      "Ibadan North-East",
      "Ibadan North-West",
      "Ibadan South-East",
      "Ibadan South-West",
      "Ibarapa Central",
      "Ibarapa East",
      "Ibarapa North",
      "Ido",
      "Irepo",
      "Iseyin",
      "Itesiwaju",
      "Iwajowa",
      "Kajola",
      "Lagelu",
      "Ogbomoso North",
      "Ogbomoso South",
      "Ogo Oluwa",
      "Olorunsogo",
      "Oluyole",
      "Ona Ara",
      "Orelope",
      "Oriire",
      "Oyo East",
      "Oyo West",
      "Saki East",
      "Saki West",
      "Surulere",
    ],

    Plateau: [
      "Barkin Ladi",
      "Bassa",
      "Bokkos",
      "Jos East",
      "Jos North",
      "Jos South",
      "Kanam",
      "Kanke",
      "Langtang North",
      "Langtang South",
      "Mangu",
      "Mikang",
      "Pankshin",
      "Qua'an Pan",
      "Riyom",
      "Shendam",
      "Wase",
    ],

    Rivers: [
      "Abua/Odual",
      "Ahoada East",
      "Ahoada West",
      "Akuku-Toru",
      "Andoni",
      "Asari-Toru",
      "Bonny",
      "Degema",
      "Eleme",
      "Emohua",
      "Etche",
      "Gokana",
      "Ikwerre",
      "Khana",
      "Obio/Akpor",
      "Ogba/Egbema/Ndoni",
      "Ogu/Bolo",
      "Okrika",
      "Omuma",
      "Opobo/Nkoro",
      "Oyigbo",
      "Port Harcourt",
      "Tai",
    ],

    Sokoto: [
      "Binji",
      "Bodinga",
      "Dange Shuni",
      "Gada",
      "Goronyo",
      "Gudu",
      "Gwadabawa",
      "Illela",
      "Isa",
      "Kebbe",
      "Kware",
      "Rabah",
      "Sabon Birni",
      "Shagari",
      "Silame",
      "Sokoto North",
      "Sokoto South",
      "Tambuwal",
      "Tangaza",
      "Tureta",
      "Wamakko",
      "Wurno",
      "Yabo",
    ],

    Taraba: [
      "Ardo Kola",
      "Bali",
      "Donga",
      "Gashaka",
      "Gassol",
      "Ibi",
      "Jalingo",
      "Karim Lamido",
      "Kumi",
      "Lau",
      "Sardauna",
      "Takum",
      "Ussa",
      "Wukari",
      "Yorro",
      "Zing",
    ],

    Yobe: [
      "Bade",
      "Bursari",
      "Damaturu",
      "Fika",
      "Fune",
      "Geidam",
      "Gujba",
      "Gulani",
      "Jakusko",
      "Karasuwa",
      "Machina",
      "Nangere",
      "Nguru",
      "Potiskum",
      "Tarmuwa",
      "Yunusari",
      "Yusufari",
    ],

    Zamfara: [
      "Anka",
      "Bakura",
      "Birnin Magaji/Kiyaw",
      "Bukun Yum",
      "Bungudu",
      "Gummi",
      "Gusau",
      "Kaura Namoda",
      "Maradun",
      "Maru",
      "Shinkafi",
      "Talata Mafara",
      "Tsafe",
      "Zurmi",
    ],

    "Federal Capital Territory": [
      "Abaji",
      "Abuja Municipal Area Council",
      "Bwari",
      "Gwagwalada",
      "Kuje",
      "Kwali",
    ],
  },

  Ghana: {
    "Greater Accra": [
      "Accra Metropolitan",
      "Adenta Municipal",
      "Ashaiman Municipal",
      "Ga Central Municipal",
      "Ga East Municipal",
      "Ga North Municipal",
      "Ga South Municipal",
      "Ga West Municipal",
      "La Dade-Kotopon Municipal",
      "La Nkwantanang-Madina Municipal",
      "Ledzokuku Municipal",
      "Ningo-Prampram",
      "Shai Osudoku",
      "Tema Metropolitan",
      "Tema West Municipal",
    ],

    Ashanti: [
      "Kumasi Metropolitan",
      "Asante Akim Central",
      "Asante Akim North",
      "Asante Akim South",
      "Atwima Kwanwoma",
      "Atwima Nwabiagya",
      "Ejisu",
      "Ejura Sekyedumase",
      "Kwabre East",
      "Mampong Municipal",
      "Obuasi Municipal",
      "Offinso Municipal",
      "Sekyere East",
      "Sekyere Kumawu",
      "Sekyere South",
    ],

    Western: [
      "Ahanta West",
      "Ellembelle",
      "Jomoro",
      "Mpohor",
      "Nzema East",
      "Prestea-Huni Valley",
      "Sekondi-Takoradi Metropolitan",
      "Shama",
      "Tarkwa-Nsuaem",
      "Wassa Amenfi East",
      "Wassa Amenfi West",
    ],

    Eastern: [
      "Akuapem North",
      "Akuapem South",
      "Asuogyaman",
      "Atiwa East",
      "Atiwa West",
      "Birim Central",
      "Birim North",
      "Birim South",
      "Fanteakwa North",
      "Fanteakwa South",
      "Kwahu East",
      "Kwahu South",
      "Kwahu West",
      "New Juaben North",
      "New Juaben South",
      "Suhum",
    ],

    Central: [
      "Abura-Asebu-Kwamankese",
      "Agona East",
      "Agona West",
      "Ajumako-Enyan-Essiam",
      "Asikuma-Odoben-Brakwa",
      "Assin Central",
      "Assin North",
      "Assin South",
      "Cape Coast Metropolitan",
      "Effutu",
      "Ekumfi",
      "Gomoa East",
      "Gomoa West",
      "Komenda-Edina-Eguafo-Abirem",
      "Mfantsiman",
    ],

    Northern: [
      "Gushegu",
      "Karaga",
      "Kumbungu",
      "Mion",
      "Nanumba North",
      "Nanumba South",
      "Saboba",
      "Sagnarigu",
      "Savelugu",
      "Tamale Metropolitan",
      "Tatale Sanguli",
      "Tolon",
      "Yendi Municipal",
      "Zabzugu",
    ],
  },

  Kenya: {
    Nairobi: [
      "Westlands",
      "Dagoretti North",
      "Dagoretti South",
      "Langata",
      "Kibra",
      "Roysambu",
      "Kasarani",
      "Ruaraka",
      "Embakasi South",
      "Embakasi North",
      "Embakasi Central",
      "Embakasi East",
      "Embakasi West",
      "Starehe",
      "Mathare",
    ],

    Mombasa: [
      "Changamwe",
      "Jomvu",
      "Kisauni",
      "Likoni",
      "Mvita",
      "Nyali",
    ],

    Kisumu: [
      "Kisumu East",
      "Kisumu West",
      "Kisumu Central",
      "Seme",
      "Nyando",
      "Muhoroni",
      "Nyakach",
    ],

    Nakuru: [
      "Nakuru Town East",
      "Nakuru Town West",
      "Naivasha",
      "Gilgil",
      "Kuresoi North",
      "Kuresoi South",
      "Subukia",
      "Bahati",
      "Njoro",
    ],

    Kiambu: [
      "Gatundu South",
      "Gatundu North",
      "Githunguri",
      "Juja",
      "Kabete",
      "Kiambu",
      "Kikuyu",
      "Limuru",
      "Ruiru",
      "Thika Town",
      "Lari",
      "Thika East",
    ],
  },

  "South Africa": {
    Gauteng: [
      "City of Johannesburg",
      "City of Tshwane",
      "Ekurhuleni",
      "Emfuleni",
      "Lesedi",
      "Merafong City",
      "Midvaal",
      "Mogale City",
      "Rand West City",
    ],

    "Western Cape": [
      "Cape Town",
      "Drakenstein",
      "George",
      "Knysna",
      "Overstrand",
      "Stellenbosch",
      "Swartland",
      "Witzenberg",
    ],

    "KwaZulu-Natal": [
      "eThekwini",
      "Msunduzi",
      "Newcastle",
      "uMhlathuze",
      "Umdoni",
    ],

    "Eastern Cape": [
      "Buffalo City",
      "Nelson Mandela Bay",
      "Amahlathi",
      "Blue Crane Route",
      "Great Kei",
      "Kouga",
      "Makana",
      "Ndlambe",
    ],

    "Free State": [
      "Mangaung",
      "Matjhabeng",
      "Metsimaholo",
      "Mohokare",
      "Nala",
      "Phumelela",
    ],

    Limpopo: [
      "Polokwane",
      "Makhado",
      "Mokopane",
      "Musina",
      "Thulamela",
      "Greater Giyani",
    ],

    Mpumalanga: [
      "Mbombela",
      "Emalahleni",
      "Govan Mbeki",
      "Bushbuckridge",
      "Nkomazi",
      "Steve Tshwete",
    ],

    "North West": [
      "Rustenburg",
      "Mahikeng",
      "Matlosana",
      "JB Marks",
      "Madibeng",
      "Moses Kotane",
    ],

    "Northern Cape": [
      "Sol Plaatje",
      "Dawid Kruiper",
      "Kgatelopele",
      "Magareng",
      "Phokwane",
    ],
  },

  Egypt: {
    Cairo: [
      "Cairo",
      "Heliopolis",
      "Nasr City",
      "Maadi",
      "New Cairo",
      "Shubra",
    ],

    Alexandria: [
      "Alexandria",
      "Borg El Arab",
      "Montaza",
      "Smouha",
    ],

    Giza: [
      "Giza",
      "6th of October",
      "Sheikh Zayed",
      "Dokki",
      "Agouza",
    ],

    "Red Sea": [
      "Hurghada",
      "Safaga",
      "El Quseir",
      "Marsa Alam",
    ],
  },

  Ethiopia: {
    "Addis Ababa": [
      "Addis Ketema",
      "Akaki Kality",
      "Arada",
      "Bole",
      "Gullele",
      "Kirkos",
      "Kolfe Keranio",
      "Lideta",
      "Nifas Silk-Lafto",
      "Yeka",
    ],

    Oromia: [
      "Adama",
      "Bishoftu",
      "Jimma",
      "Shashamane",
      "Ambo",
      "Nekemte",
    ],

    Amhara: [
      "Bahir Dar",
      "Gondar",
      "Dessie",
      "Debre Birhan",
    ],

    Tigray: [
      "Mekelle",
      "Adigrat",
      "Axum",
    ],
  },

  Tanzania: {
    "Dar es Salaam": [
      "Ilala",
      "Kinondoni",
      "Temeke",
      "Kigamboni",
      "Ubungo",
    ],

    Arusha: [
      "Arusha City",
      "Arumeru",
      "Karatu",
      "Longido",
      "Monduli",
      "Ngorongoro",
    ],

    Dodoma: [
      "Dodoma Urban",
      "Bahi",
      "Chamwino",
      "Chemba",
      "Kondoa",
      "Kongwa",
      "Mpwapwa",
    ],

    Mwanza: [
      "Ilemela",
      "Nyamagana",
      "Buchosa",
      "Kwimba",
      "Magu",
      "Misungwi",
      "Sengerema",
    ],
  },

  Uganda: {
    Kampala: [
      "Central Division",
      "Kawempe Division",
      "Makindye Division",
      "Nakawa Division",
      "Rubaga Division",
    ],

    Wakiso: [
      "Entebbe",
      "Kira",
      "Nansana",
      "Makindye Ssabagabo",
      "Wakiso",
    ],

    Gulu: [
      "Gulu City",
      "Aswa",
      "Bungatira",
      "Paicho",
      "Awach",
    ],

    Mbarara: [
      "Mbarara City",
      "Bubaare",
      "Kakoba",
      "Nyamitanga",
      "Nyakayojo",
    ],
  },

  Rwanda: {
    Kigali: [
      "Gasabo",
      "Kicukiro",
      "Nyarugenge",
    ],

    Eastern: [
      "Bugesera",
      "Gatsibo",
      "Kayonza",
      "Kirehe",
      "Ngoma",
      "Nyagatare",
      "Rwamagana",
    ],

    Northern: [
      "Burera",
      "Gakenke",
      "Gicumbi",
      "Musanze",
      "Rulindo",
    ],

    Southern: [
      "Gisagara",
      "Huye",
      "Kamonyi",
      "Muhanga",
      "Nyamagabe",
      "Nyanza",
      "Nyaruguru",
      "Ruhango",
    ],

    Western: [
      "Karongi",
      "Ngororero",
      "Nyabihu",
      "Nyamasheke",
      "Rubavu",
      "Rusizi",
      "Rutsiro",
    ],
  },

  Zambia: {
    Lusaka: [
      "Lusaka",
      "Chongwe",
      "Kafue",
      "Luangwa",
      "Rufunsa",
    ],

    Copperbelt: [
      "Kitwe",
      "Ndola",
      "Chingola",
      "Kalulushi",
      "Mufulira",
      "Luanshya",
    ],

    Central: [
      "Kabwe",
      "Chibombo",
      "Kapiri Mposhi",
      "Mkushi",
      "Serenje",
    ],

    Southern: [
      "Livingstone",
      "Choma",
      "Kalomo",
      "Mazabuka",
      "Monze",
      "Siavonga",
    ],
  },

  Zimbabwe: {
    Harare: [
      "Harare",
      "Chitungwiza",
      "Epworth",
    ],

    Bulawayo: [
      "Bulawayo",
    ],

    Manicaland: [
      "Mutare",
      "Chipinge",
      "Makoni",
      "Mutasa",
      "Nyanga",
    ],

    "Mashonaland East": [
      "Marondera",
      "Chikomba",
      "Murehwa",
      "Mutoko",
      "Seke",
    ],
  },

  Botswana: {
    Central: [
      "Bobonong",
      "Boteti",
      "Mahalapye",
      "Serowe",
      "Tutume",
    ],

    Gaborone: [
      "Gaborone",
    ],

    "North East": [
      "Francistown",
      "North East",
    ],

    "North West": [
      "Maun",
      "Chobe",
      "Ngamiland East",
    ],
  },

  Namibia: {
    Khomas: [
      "Windhoek",
      "Katutura",
      "Khomasdal",
    ],

    Erongo: [
      "Walvis Bay",
      "Swakopmund",
      "Omaruru",
    ],

    Oshana: [
      "Oshakati",
      "Ondangwa",
      "Ongwediva",
    ],
  },

  Senegal: {
    Dakar: [
      "Dakar",
      "Guediawaye",
      "Pikine",
      "Rufisque",
    ],

    Thies: [
      "Thies",
      "Mbour",
      "Tivaouane",
    ],

    "Saint-Louis": [
      "Saint-Louis",
      "Dagana",
      "Podor",
    ],
  },

  Morocco: {
    "Casablanca-Settat": [
      "Casablanca",
      "Mohammedia",
      "El Jadida",
      "Settat",
    ],

    "Rabat-Sale-Kenitra": [
      "Rabat",
      "Sale",
      "Kenitra",
      "Temara",
    ],

    "Marrakesh-Safi": [
      "Marrakesh",
      "Safi",
      "Essaouira",
    ],

    "Fes-Meknes": [
      "Fes",
      "Meknes",
      "Ifrane",
    ],
  },

  Algeria: {
    Algiers: [
      "Algiers",
      "Bab El Oued",
      "Bir Mourad Rais",
      "Dar El Beida",
      "Hussein Dey",
    ],

    Oran: [
      "Oran",
      "Bir El Djir",
      "Es Senia",
      "Arzew",
    ],

    Constantine: [
      "Constantine",
      "El Khroub",
      "Hamma Bouziane",
    ],
  },

  Tunisia: {
    Tunis: [
      "Tunis",
      "Carthage",
      "La Marsa",
      "Le Bardo",
    ],

    Sfax: [
      "Sfax",
      "Sakiet Ezzit",
      "Sakiet Eddaier",
    ],

    Sousse: [
      "Sousse",
      "Hammam Sousse",
      "Akouda",
    ],
  },

  Cameroon: {
    Centre: [
      "Yaounde I",
      "Yaounde II",
      "Yaounde III",
      "Yaounde IV",
      "Yaounde V",
      "Yaounde VI",
      "Yaounde VII",
    ],

    Littoral: [
      "Douala I",
      "Douala II",
      "Douala III",
      "Douala IV",
      "Douala V",
      "Douala VI",
    ],

    Northwest: [
      "Bamenda I",
      "Bamenda II",
      "Bamenda III",
      "Bafut",
      "Santa",
    ],

    Southwest: [
      "Buea",
      "Limbe I",
      "Limbe II",
      "Limbe III",
      "Kumba",
    ],
  },

  "Côte d'Ivoire": {
    "Abidjan District": [
      "Abobo",
      "Adjamé",
      "Anyama",
      "Attécoubé",
      "Cocody",
      "Koumassi",
      "Marcory",
      "Plateau",
      "Port-Bouët",
      "Treichville",
      "Yopougon",
    ],

    Yamoussoukro: [
      "Yamoussoukro",
      "Attiégouakro",
    ],
  },

  Angola: {
    Luanda: [
      "Luanda",
      "Belas",
      "Cacuaco",
      "Cazenga",
      "Viana",
      "Talatona",
      "Kilamba Kiaxi",
    ],

    Benguela: [
      "Benguela",
      "Lobito",
      "Catumbela",
    ],

    Huambo: [
      "Huambo",
      "Caala",
      "Longonjo",
    ],
  },

  Mozambique: {
    Maputo: [
      "Maputo City",
      "Matola",
      "Boane",
      "Marracuene",
    ],

    Sofala: [
      "Beira",
      "Dondo",
      "Nhamatanda",
    ],

    Nampula: [
      "Nampula",
      "Nacala",
      "Angoche",
    ],
  },

  Madagascar: {
    Analamanga: [
      "Antananarivo",
      "Ambohidratrimo",
      "Andramasina",
      "Anjozorobe",
      "Manjakandriana",
    ],

    Atsinanana: [
      "Toamasina",
      "Brickaville",
      "Fenerive Est",
    ],
  },

  Malawi: {
    Central: [
      "Lilongwe",
      "Dedza",
      "Kasungu",
      "Mchinji",
      "Nkhotakota",
      "Ntchisi",
    ],

    Southern: [
      "Blantyre",
      "Chikwawa",
      "Chiradzulu",
      "Machinga",
      "Mangochi",
      "Mulanje",
      "Mwanza",
      "Nsanje",
      "Thyolo",
      "Zomba",
    ],

    Northern: [
      "Mzuzu",
      "Chitipa",
      "Karonga",
      "Likoma",
      "Mzimba",
      "Nkhata Bay",
      "Rumphi",
    ],
  },

  Liberia: {
    Montserrado: [
      "Monrovia",
      "Paynesville",
      "Caldwell",
      "New Kru Town",
    ],

    Bong: [
      "Gbarnga",
      "Salala",
      "Suakoko",
    ],

    Nimba: [
      "Ganta",
      "Sanniquellie",
      "Tappita",
    ],
  },

  "Sierra Leone": {
    Western: [
      "Freetown",
      "Waterloo",
      "Hastings",
    ],

    Bo: [
      "Bo",
      "Tikonko",
      "Baoma",
    ],

    Kenema: [
      "Kenema",
      "Koya",
      "Nomo",
    ],
  },

  Gambia: {
    "West Coast": [
      "Brikama",
      "Fajikunda",
      "Sukuta",
      "Lamin",
    ],

    Kanifing: [
      "Serekunda",
      "Bakau",
      "Fajara",
    ],

    Banjul: [
      "Banjul",
    ],
  },

  Guinea: {
    Conakry: [
      "Kaloum",
      "Dixinn",
      "Matam",
      "Ratoma",
      "Matoto",
    ],

    Kindia: [
      "Kindia",
      "Coyah",
      "Dubréka",
    ],
  },

  Benin: {
    Atlantique: [
      "Abomey-Calavi",
      "Allada",
      "Ouidah",
      "Toffo",
    ],

    Littoral: [
      "Cotonou",
    ],

    Ouémé: [
      "Porto-Novo",
      "Adjarra",
      "Akpro-Missérété",
    ],
  },

  Togo: {
    Maritime: [
      "Lomé",
      "Aného",
      "Tsévié",
    ],

    Plateaux: [
      "Atakpamé",
      "Kpalimé",
      "Notsé",
    ],
  },

  "Burkina Faso": {
    Centre: [
      "Ouagadougou",
      "Komki-Ipala",
      "Komsilga",
      "Tanghin-Dassouri",
    ],

    "Hauts-Bassins": [
      "Bobo-Dioulasso",
      "Faramana",
      "Koundougou",
    ],
  },

  Mali: {
    Bamako: [
      "Bamako I",
      "Bamako II",
      "Bamako III",
      "Bamako IV",
      "Bamako V",
      "Bamako VI",
    ],

    Kayes: [
      "Kayes",
      "Bafoulabé",
      "Kita",
    ],

    Sikasso: [
      "Sikasso",
      "Koutiala",
      "Bougouni",
    ],
  },

  Niger: {
    Niamey: [
      "Niamey I",
      "Niamey II",
      "Niamey III",
      "Niamey IV",
      "Niamey V",
    ],

    Zinder: [
      "Zinder",
      "Mirriah",
      "Magaria",
    ],

    Maradi: [
      "Maradi",
      "Dakoro",
      "Guidan Roumdji",
    ],
  },

  Chad: {
    "N'Djamena": [
      "1st Arrondissement",
      "2nd Arrondissement",
      "3rd Arrondissement",
      "4th Arrondissement",
      "5th Arrondissement",
      "6th Arrondissement",
      "7th Arrondissement",
      "8th Arrondissement",
      "9th Arrondissement",
      "10th Arrondissement",
    ],
  },

  Sudan: {
    Khartoum: [
      "Khartoum",
      "Omdurman",
      "Khartoum North",
      "Jebel Aulia",
    ],

    Gezira: [
      "Wad Madani",
      "Al Kamlin",
      "Hasaheisa",
    ],
  },

  "South Sudan": {
    "Central Equatoria": [
      "Juba",
      "Kajo-Keji",
      "Lainya",
      "Nimule",
      "Yei",
    ],

    "Western Equatoria": [
      "Yambio",
      "Maridi",
      "Mundri",
    ],
  },

  Somalia: {
    Banaadir: [
      "Mogadishu",
      "Hodan",
      "Waberi",
      "Warta Nabada",
      "Yaqshid",
    ],

    Puntland: [
      "Garowe",
      "Bosaso",
      "Galkayo",
    ],
  },

  Djibouti: {
    Djibouti: [
      "Djibouti City",
      "Balbala",
      "Boulaos",
      "Ras-Dika",
    ],
  },

  Eritrea: {
    Maekel: [
      "Asmara",
      "Serejeka",
    ],

    Anseba: [
      "Keren",
      "Hagaz",
    ],
  },

  Eswatini: {
    Hhohho: [
      "Mbabane",
      "Piggs Peak",
    ],

    Manzini: [
      "Manzini",
      "Matsapha",
    ],

    Lubombo: [
      "Siteki",
      "Big Bend",
    ],

    Shiselweni: [
      "Nhlangano",
    ],
  },

  Lesotho: {
    Maseru: [
      "Maseru",
      "Mazenod",
      "Roma",
    ],

    Leribe: [
      "Hlotse",
      "Maputsoe",
    ],

    Mafeteng: [
      "Mafeteng",
    ],
  },

  Gabon: {
    Estuaire: [
      "Libreville",
      "Owendo",
      "Akanda",
      "Ntoum",
    ],

    "Haut-Ogooué": [
      "Franceville",
      "Moanda",
    ],
  },

  "Republic of the Congo": {
    Brazzaville: [
      "Brazzaville",
      "Mfilou",
      "Moungali",
      "Ouenzé",
      "Poto-Poto",
    ],

    "Pointe-Noire": [
      "Pointe-Noire",
      "Loandjili",
      "Mongo-Mpoukou",
    ],
  },

  "Democratic Republic of the Congo": {
    Kinshasa: [
      "Gombe",
      "Kintambo",
      "Kinshasa",
      "Lemba",
      "Limete",
      "Ngaliema",
      "Ngiri-Ngiri",
    ],

    "North Kivu": [
      "Goma",
      "Beni",
      "Butembo",
      "Masisi",
    ],
  },

  "Central African Republic": {
    "Ombella-M'Poko": [
      "Bangui",
      "Bimbo",
      "Boali",
    ],
  },

  "Equatorial Guinea": {
    "Bioko Norte": [
      "Malabo",
      "Baney",
    ],

    Litoral: [
      "Bata",
      "Mbini",
    ],
  },

  "São Tomé and Príncipe": {
    "São Tomé": [
      "São Tomé",
      "Trindade",
      "Guadalupe",
    ],
  },

  Comoros: {
    Ngazidja: [
      "Moroni",
      "Mitsamiouli",
      "Fomboni",
    ],

    Anjouan: [
      "Mutsamudu",
      "Domoni",
    ],

    Mohéli: [
      "Fomboni",
    ],
  },

  Seychelles: {
    Mahé: [
      "Victoria",
      "Beau Vallon",
      "Anse Royale",
    ],

    Praslin: [
      "Baie Sainte Anne",
    ],

    "La Digue": [
      "La Passe",
    ],
  },

  Mauritius: {
    "Port Louis": [
      "Port Louis",
    ],

    "Plaines Wilhems": [
      "Beau Bassin-Rose Hill",
      "Quatre Bornes",
      "Vacoas-Phoenix",
    ],

    Moka: [
      "Moka",
    ],
  },

  Libya: {
    Tripoli: [
      "Tripoli",
      "Tajoura",
      "Abu Salim",
    ],

    Benghazi: [
      "Benghazi",
      "Al Abyar",
      "Qaminis",
    ],
  },

  Mauritania: {
    Nouakchott: [
      "Tevragh-Zeina",
      "Ksar",
      "Sebkha",
      "Dar-Naim",
      "Teyarett",
      "Arafat",
      "El Mina",
      "Riyad",
    ],

    "Dakhlet Nouadhibou": [
      "Nouadhibou",
    ],
  },

  "Cape Verde": {
    Santiago: [
      "Praia",
      "Assomada",
      "Tarrafal",
    ],

    "São Vicente": [
      "Mindelo",
    ],
  },

  "Western Sahara": {
    "Laayoune-Sakia El Hamra": [
      "Laayoune",
      "Tarfaya",
      "Smara",
    ],

    "Dakhla-Oued Ed-Dahab": [
      "Dakhla",
    ],
  },
};

/**
 * All available African countries.
 */
export const AFRICAN_COUNTRY_NAMES = Object.keys(
  AFRICA_LOCATIONS
).sort((a, b) => a.localeCompare(b));

/**
 * Get the first-level administrative divisions
 * for a selected country.
 *
 * Depending on the country, this may represent:
 * State, Region, Province, County, District, etc.
 */
export function getStates(country: string): string[] {
  return Object.keys(AFRICA_LOCATIONS[country] || {});
}

/**
 * Get the local administrative areas for
 * a selected country and first-level division.
 */
export function getLocalAreas(
  country: string,
  state: string
): string[] {
  return AFRICA_LOCATIONS[country]?.[state] || [];
}