      // Sample data representing car brands and models
      const carData = {
        "Chevrolet": [
            "BLAZER",
            "MALIBU",
            "CAPTIVA",
            "EQUINOX",
            "MONZA",
            "GROOVE",
            "TRACKER",
            "TRAILBLAZER",
            "TRAVERSE",
            "TRAX",
            "SUBURBAN",
            "TAHOE",
            "ONIX PLUS",
            "COLORADO",
            "MONTANA",
            "MAX",
            "SILVERADO",
            "OPTRA",
            "SAIL/AVEO",
            "MENLO",
            "ONIX",
            "ORLANDO",
            "SPIN",
            "EXPRESS",
            "N300",
            "N400"      
        ],

        "Audi": [ 
            "AUDI QUATTRO",
            "AUDI 100 AND 200 / AUDI 500",
            "AUDI A3",
            "AUDI A4",
            "AUDI TT",
            "AUDI A6",
            "AUDI S6",
            "AUDI S3", 
            "AUDI S5",
            "AUDI R8 (TYPE 4S)",
            "AUDI Q7",
            "AUDI A8",
            "AUDI Q8 e-tron",
            "AUDI RS6",
            "AUDI ROSEMEYER",
            "AUDI Q5",
            "AUDI A5",
            "AUDI e-tron GT",
            "AUDI A7",
            "AUDI R8 (TYPE 42)",
            "AUDI RS 2 AVAT",
            "AUDI LE MANS QUATTRO",
            "AUDI COUPE",
            "AUDI A1",
            "AUDI Q5",
            "AUDI RS 6",
            "AUDI Q4 e-TRON",
            "AUDI R8C"
          ],

        "Ford": [
            "HATCH BACK",
            "ESCORT",
            "FOCUS",
            
            "SEDAN",
            "FOCUS",
            "MONDEA/TAURUS",
            
            "STATION WAGON",
            "FOCUS",
            
            "SPORT CAR",
            "BRONCO",
            "BRONCO SPORT",
            "EDGE",
            "EDGE L",
            "EQUATOR",
            "ESCAPE",
            "EVEREST",
            "KUGA",
            "MUSTUNG", 
            
            "SUV/CROSSOVER",
            "EXPADITION ",
            "EVAS",
            "EXPLORER", 
            "EXPLORER EV",
            "EQUATOR SPORT",
            "F-SERIES",
            "MUSTUNG MECH E",
            "PUMA",
            "TERRITORY/EQUADO SPORT",
            
            "HEAVY COMMERCIAL VEHICLES",
            "CARGO",
            "E-SERIES CUTAWAY",
            "F-MAX",
            "F-SERIE",
            "TRANSIT CUTAWAY",
            "SUPER DUT",
            
            "MPV/MINI VAN",
            "TOURNEO CONNECT",
            "TOURNEO COURIER",
            
            "VAN",
            "TRANSIT",
            "TRANSIT CONNECT",
            "TRANSIT COURIER",
            "TRANSIT CUSTOM",
            
            "PICK-UP TRUCK",
            "F-150 LIGHTNING",
            "MAVERICK",
            "RANGER",
            "TRANSIT",
            "TOURNEO COURIER"
              ],

      "Honda": [
              "HATCHBACK",
              "Brio",
              "City",
              "Civic",
              "Integra",
              "Fit-Jazz-Life",
              
              "SEDAN",
              "Accord/Inspire",
              "Amaze",
              "City/Ballad",
              "Civic/Integra",
              "Crider/Envix",
              "Legend",
              "Prelude",
              "MPV/Minivan/Station Wagon",
              "Freed",
              "Mobillo",
              "Odyssey/Elysion",
              "Stepwgn",
             
             "CROSSOVER/SUV",
              "Avancier/UR-V",
              "BR-V",
              "CR-V/Breeze",
              "Crosstour",
              "Element",
              "Elevate/WR-V",
              "e:NS2/e:NP2",
              "HR-V/Vezel/XR-V",
              "Passport",
              "Pilot",
              "Prologue",
              "WR-V",
              "ZR-V/HR-V",
              "PICKUP TRUCK",
              "Ridgeline",
              
              "SPORTS/PERFORMANCE CAR",
              "Civic Type R"
                   ],

      "Lexus": [
              "250H",
              "CT200H0",
              "IS220D",
              "IS250",
              "IS250C",
              "IS300",
              "IS300C",
              "IS300H",
              "IS350",
              "IS350C",
              "LC500",
              "LC500H",
              "LFA",
              "LM300H",
              "LM350",
              "LM350H",
              "LS350",
              "LS400",
              "LS430",
              "LS460",
              "LS460L",
              "LS500",
              "LS500H",
              "LS600H",
              "LS600HL",
              "LX450",
              "LX450D",
              "LX460",
              "LX470",
              "LX500D",
              "LX570",
              "LX600",
              "NX200T",
              "NX250",
              "NX300H",
              "NX350",
              "NX350H",
              "NX450H",
              "RC F",
              "RC200T",
              "RC300",
              "RC300H",
              "RC350",
              "RX200T",
              "RX270",
              "RX300",
              "RX330",
              "RX350",
              "RX350L",
              "RX400H",
              "RX450H",
              "RX450HL",
              "RZ450E",
              "SC300",
              "SC400",
              "SC430",
              "UX2##H",
              "UX200",
              "UX250H",
              "UX300E"
              ],
      
      "Mercedes Benz": [
              "A-Class",
          
              "A 140",
              "A 140L",
              "A 140 Automatic",
              "A 140 L Automatic",
              "A 160 L",
              "A 190",
              "A 190 L",  
              "A 210 Evolution",
              "A 210 Evolution L",
              "A 32K AMG (Prototype)",
              "A 38 AMG (Prototype)",
              "A 160 CDI",
              "A 170 CDI",
              "A 170 CDI L",
              "A 150",
              "A 170",
              "A 200",
              "A 200 Turbo",
              "A 160 CDI",
              "A 180 CDI",
              "A 200 CDI",
              "A 180 2014",
              "A 180 2019",
              "A 220",
              "A 35 AMG",
              "A 45 AMG",
              "AMG GT",
              "AMG GT 43",
              "AMG GT 53",
              "AMG GT 63",
           
              "B-Class",
              
              "B 160",
              "B 170",
              "B 180",
              "B 200",
              "B 200 Turbo",
              "B 180 CDI",
              "B 200 CDI",
              "B 170 NGT",
              "B 220",
              "B 250",
              "B 180 d",
              "B 200 d",
              "B 220 d",
              "B 250 e",
           
              "C-Class",
              
              "W 202 sedan",
              "W 203 sedan",
              "W 204 sedan",
              "W 205 sedan",
              "W 206 sedan",
           
              "CLA-Class (C 117; 2013)",
           
              "CLA 180 BlueEFFICIENCY Edition",
              "CLA 180",
              "CLA 200",
              "CLA 220 4MATIC",
              "CLA 250",
              "CLA 250 Sport",
              "CLA 250 4MATIC",
              "CLA 250 4MATIC Sport",
              "CLA 45 AMG",
              "CLA 180 CDI/CLA 180 d",
              "CLA 200 CDI/CLA 200 d",
              "CLA 200 CDI 4MATIC/CLA 200 d 4MATIC",
              "CLA 220 CDI/CLA 220 d",
              "CLA 220 CDI 4MATIC/CLA 220 d 4MATIC",
              
              "CLA-Class (C 118; 2019)",
              
              "CLA 180",
              "CLA 200",
              "CLA 200 4MATIC",
              "CLA 220",
              "CLA 220 4MATIC",
              "CLA 250",
              "CLA 250 4MATIC",
              "CLA 35 AMG",
              "CLA 45 AMG 4MATIC+",
              "CLA 45 S AMG 4MATIC+",
              "CLA 180 d",
              "CLA 200 d",
              "CLA 200 d 4MATIC",
              "CLA 220 d",
              "CLA 220 d 4MATIC",
              "CLA 250 e",
              
              "E-Class",
              
              "E 200",
              "E 350",
              "E 450",
              "E 300e",
              "E 400e",
              "E 220d",
              "E 450d",
              "E 300de",
              
              "Mercedes-Benz EQE",
              
              "EQE 300",
              "EQE 350",
              "EQE 350+",
              "EQE 350",
              "4MATIC",
              "EQE 500",
              "4MATIC",
              "AMG EQE 43",
              "4MATIC",
              "AMG EQE 53",
              "4MATIC+",
              
              "Mercedes-Benz EQS",
              
              "EQS 350",
              "EQS 450+",
              "EQS 450",
              "4MATIC",
              "EQS 500",
              "4MATIC",
              "EQS 580",
              "4MATIC",
              "AMG EQS ",
              "4MATIC+",
              
              "S-Class",
              
              "S280",
              "S 300",
              "S 320",
              "S 320L",
              "S 420",
              "S 420L",
              "S 500",
              "S 500L",
              "S 600",
              "S 600L",
              "S 280",
              "S 320",
              "S 320 CD",
              "S 400 CDI",
              "S 350",
              "S 430",
              "S 500",
              "S 600",
              "S 55",
              "S 63",
              "S 65 AMG",
              "S 250 CDI",
              "S 300",
              "S 350",
              "S 400 HYBRID",
              "S 450",
              "S 550",
              "S 600"
          ],

      "Nissan": [
              "AD",
              "ALMERA",
              "ALTIMA",
              "ARMADA",
              "ARIYA",
              "ATLAS",
              "CABSTAR",
              "CARAVAN  ",
              "DAYZ",
              "ELGRAND",
              "EVALIA",
              "FRONTIER(D41)",
              "GT-R",
              "INTERSTAR",
              "JUKE",
              "KICKS",
              "LEAF",
              "LIVINA",
              "MAGNITE",
              "MICRA",
              "MURANO",
              "NAVANA/NP300(D23)",
              "NOTE",
              "NP200",
              "NT100 CLIPPER",
              "NV100/CLIPPER",
              "NV200/EVALIA",
              "PATHFINDER",
              "PATROL(Y61)",
              "PATROL(Y62)",
              "PRIMASTAR",
              "QASHQAI",
              "ROGUE",
              "ROOX",
              "SAKURA",
              "SERENA",
              "SKYLINE",
              "SYLPHY",
              "SUNNY",
              "TERRA",
              "TILDA",
              "TITAN",
              "TOWNSTAR",
              "URVAN",
              "VERSA",
              "V-DRIVE",
              "X-TERRA",
              "X-TRAIL",
              "Z"
                   ],

      "Peugeot": [
              "PEUGEOT 208",
              "PEUGEOT 3008",
              "PEUGEOT 508",
              "PEUGEOT 505",
              "PEUGEOT 2008",
              "PEUGEOT 202",
              "PEUGEOT 5008",
              "PEUGEOT 308",
              "PEUGEOT 206",
              "PEUGEOT 306",
              "SUV",
              "LANDTREK",
              "PEUGEOT 106",
              "PEUGEOT 208 GTi",
              "PEUGEOT SPORT ENGINEERED",
              "PEUGEOT 307",
              "HYPERCAR 9X8",
              "PEUGEOT 408",
              "PEUGEOT 104",
              "PEUGEOT 4007",
              "PEUGEOT 207",
              "PEUGEOT 108",
              "PEUGEOT 405",
              "PEUGEOT 508",
              "PEUGEOT 4007",
              "BOXER",
              "PEUGEOT 406", 
              "PEUGEOT RCZ VARIANTS",
              "PEUGEOT 107"
                  ],
                  
      "Suzuki": [
              "Specifications for Suzuki Japan",
              "Aerio RB21S-6",
              "Aerio RB21S-4",
              "Aerio RB21S-5",
              "Aerio RB21S",
              "Aerio RB21S-2",
              "Aerio RB21S-3",
              "Alto CN21S",
              "Alto CL11V",
              "Alto CA72V",
              "Alto HA11S",
              "Alto HA11S-2",
              "Alto CR22S",
              "Alto CL22V",
              "Alto CN11S",
              "Alto HA12S-2",
              "Alto HA12S",
              "Alto HA23S-3",
              "Alto HA24S-3",
              "Alto HA24S-4",
              "Alto HA24S-2",
              "Alto CA71V",
              "Alto HA23S-4",
              "Alto HA24S",
              "Alto HA25S",
              "Cappuccino EA21R",
              "Cappuccino EA11R",
              "Cara PG6SS",
              "Carry Truck DA63T7T",
              "Carry Truck	DA63T8T",
              "Carry Truck	DA63T9T",
              "Carry/Every	DA71T-3",
              "Carry/Every	DB71T-3",
              "Carry/Every	DA52T",
              "Carry/Every	DA64V5Y",
              "Carry/Every	DA62V-5",
              "Carry/Every	DA62V-6",
              "Carry/Every	DA64V",
              "Carry/Every	DA32W",
              "Carry/Every	DA64V-5",
              "Carry/Every	DA71T",
              "Carry/Every	DB71T",
              "Carry/Every	DA51T",
              "Carry/Every	DA41T",
              "Carry/Every	DC51T",
              "Carry/Every	DC51T-5",
              "Carry/Every	DA52T-3",
              "Carry/Every	DA52T-2",
              "Carry/Every	DA62V-4",
              "Carry/Every	DA64V-4",
              "Carry/Every	DA64V-3",
              "Carry/Every	DA64V-2",
              "Carry/Every	DA63T-9",
              "Carry/Every	DA63T-7",
              "Carry/Every	DA63T-5",
              "Carry/Every	DA63T-8",
              "Carry/Every	DA63T-6",
              "Carry/Every	DA32W-4",
              "Carry/Every	DA65T",
              "Carry/Every	DA65T-3",
              "Carry/Every	DA65T-2",
              "Carry/Every	DA64V5T",
              "Cervo	CN22S-6",
              "Cervo	CN32S",
              "Cervo	CN31S",
              "Cervo G	HG21S-4",
              "Cervo G	HG21S",
              "Cervo G	HG21S-3",
              "Cervo G	HG21S-2",
              "Chevrolet Cruize/MW	HR52S-4",
              "Chevrolet Cruize/MW	HR51S",
              "Chevrolet Cruize/MW	ME34S-7",
              "Chevrolet Cruize/MW	ME34S-6",
              "Chevrolet Cruize/MW	HR52S-2",
              "Chevrolet Cruize/MW	ME34S-5",
              "Chevrolet Cruize/MW	HR52S-3",
              "Cultus AA44S",
              "Cultus AA34S",
              "Cultus AH14S",
              "Cultus GA11S-3",
              "Cultus GA11S-2",
              "Cultus GA11S",
              "Cultus GA11S-4",
              "Cultus GC21S-5",
              "Escudo TX92W-4",
              "Escudo TL52W-3",
              "Escudo TX92W-2",
              "Escudo TA02W-2",
              "Escudo TA11W",
              "Escudo TDA4W-3",
              "Escudo TD54W",
              "Escudo TA01R-2",
              "Escudo TA01R",
              "Escudo TD54W-2",
              "Escudo TA51W-3",
              "Escudo TA01R-5",
              "Escudo TA01R-7",
              "Escudo TA02W",
              "Escudo TDA4W-4",
              "Escudo TX92W-3",
              "Fronte CP11S",
              "Jimny	JA12W",
              "Jimny	JA12W-2",
              "Jimny	JA71",
              "Jimny	JA71C-3",
              "Jimny	JA11C",
              "Jimny	JB31W",
              "Jimny JB32W-3",
              "Jimny	JB43W-2",
              "Jimny	JB43W-3",
              "Jimny	JB43W-4",
              "Jimny	JB43W-7",
              "Jimny	JB43W-6",
              "Jimny	JB43W-5",
              "Jimny	JB23W-6",
              "Jimny	JB23W-4",
              "Jimny	JB23W-5",
              "Jimny	JB23W-7",
              "Jimny	JB23W",
              "Jimny	JB32W",
              "Jimny	JB33W",
              "Jimny	JB23W8Y",
              "Jimny	JB23W-8",
              "Kei/Swift	ZC11S",
              "Kei/Swift	HN22S-9",
              "Kei/Swift	HN22S10",
              "Kei/Swift	ZC11S-4",
              "Kei/Swift	HT51S-4",
              "Kei/Swift	ZC11S-3",
              "Kei/Swift	HN22S11",
              "Kei/Swift	ZC31S-2",
              "Kei/Swift	ZC31S-3",
              "Kei/Swift	ZC72S",
              "Kei/Swift	HN11S",
              "Kei/Swift	HN12S-4",
              "Kei/Swift	HN11S-3",
              "Kei/Swift	HN11S-2",
              "Kei/Swift	ZC11S-2",
              "Kei/Swift	HN22S-6",
              "Kei/Swift	HN22S-7",
              "Kei/Swift	HN22S-5",
              "Kei/Swift	HN22S-8",
              "Kei/Swift	ZC31S",
              "Kei/Swift	HT51S",
              "Kei/Swift	HT51S-3",
              "Kei/Swift	HT51S-2",
              "Kizashi	RE91S",
              "Landy	LANDY-3",
              "Landy	LANDY2",
              "Landy	LANDY-2 (2007-2008)",
              "Landy	LANDY (2006-2007)",
              "Lapin	HE21S-6",
              "Lapin	HE22S",
              "Lapin	HE22S-2",
              "Lapin	HE21S-5",
              "Lapin	HE21S-4",
              "Lapin	HE21S-3",
              "Lapin	HE21S-2",
              "Lapin	HE21S",
              "MR Wagon MF22S-3",
              "MR Wagon MF21S",
              "MR Wagon MF33S",
              "MR Wagon MF22S-2",
              "MR Wagon MF21S-2",
              "MR Wagon MF22S",
              "Palette	MK21S-3",
              "Palette	MK21S-2",
              "Palette	MK21S",
              "SX4 YA11S-2",
              "SX4 YA11S",
              "SX4 YA11S-3",
              "Splash XB32S",
              "Twin EC22S-3",
              "Twin EC22S-2",
              "Twin EC22S",
              "Wagon R	MC12S-3",
              "Wagon R	MH23S-2",
              "Wagon R	MH23S",
              "Wagon R	MH22S-5",
              "Wagon R	MA34S-6",
              "Wagon R	MA15S",
              "Wagon R	MA34S-7",
              "Wagon R	MH23S-T",
              "Wagon R	MH22S5T",
              "Wagon R	MC22S-6",
              "Wagon R	CT21S-4",
              "Wagon R	CT21S",
              "Wagon R	MC11S-2",
              "Wagon R	MA63S",
              "Wagon R	MA64S-2",
              "Wagon R	MC22S-4",
              "Wagon R	MH21S-3",
              "Wagon R	MH21S",
              "Wagon R	MH21S-2",
              "Wagon R	MA64S-3",
              "Wagon R	MC11S",
              "Wagon R	MA61S",
              "Wagon R	MH21S-4",
              "Wagon R	MC22S-5",
              "Wagon R	MA34S-4",
              "Wagon R	MA34S-5",
              "X-90 LB11S",
              "Specifications for Suzuki Europe",
              "APV",
              "Aerio",
              "Alto- A-Star/Celerio/800/Fronte",
              "Baleno/Esteem",
              "Cappuccino",
              "Carry/Supercarry/Every",
              "Ertiga",
              "Equato",
              "Forenza/Reno",
              "Forsa/Sprint/Swift (SA)",
              "Grand Vitara",
              "Grand Vitara XL-7",
              "Ignis",
              "Jimny",
              "Kei",
              "Kizashi",
              "LJ80",
              "Liana",
              "MR Wagon",
              "SX4",
              "Samurai/SJ",
              "Sierra",
              "Splash/Ritz",
              "Swift",
              "Verona",
              "Vitara/Sidekick",
              "WagonR+",
              "X90"
                  ],

      "Toyota": [
              "AGYA",
              "ALLION",
              "ALPHARD",
              "ALTEZZA",
              "AQUA",
              "ARISTO",
              "AURION",
              "AURIS  ",
              "AVALON",
              "AVENSIS",
              "AYGO",
              "BB",
              "BELTA",
              "BLADE",
              "BLIZZARD",
              "BREVIS",
              "BZ3",
              "BZ4X",
              "C+POD",
              "C+WALK T",
              "C-HR",
              "CALDINA",
              "CALYA",
              "CAMI",
              "CAMRY",
              "CARINA",
              "CELICA",
              "CELSIOR",
              "CENTURY",
              "CHASER",
              "COASTER",
              "COMFORT",
              "COPEN",
              "COROLLA",
              "CORONA",
              "CORSA",
              "CRESSIDA",
              "CRESTA",
              "CROWN",
              "CURREN",
              "CYNOS",
              "DELIBOY",
              "DUET",
              "DYNA",
              "E'Z",
              "ECHO",
              "EQ EV",
              "ESQUIRE",
              "ESTIMA",
              "ETIOS",
              "FJ CRUISER",
              "FORTUNER",
              "FRONT LANDER",
              "FUN CARGO",
              "GAIA",
              "GLANZA",
              "GR",
              "GRANACE",
              "GRAND",
              "GRANVIA",
              "GT86",
              "HARRIER",
              "HEAVY DUTY TRUCK",
              "HIACE",
              "HIGHLANDER",
              "HILUX",
              "INNOVA",
              "IPSUM",
              "IQ",
              "ISIS",
              "IST",
              "IZOA",
              "KIJANG",
              "KLUGER",
              "LAND CRUISER",
              "LEVIN",
              "LIMO",
              "LITE",
              "LUCIDA",
              "MAJESTA",
              "MARK",
              "MASTER ACE",
              "MATRIX",
              "MEGA CRUISER",
              "MIRAI",
              "MODEL-F",
              "MR-S",
              "MR2",
              "NADIA",
              "NOAH",
              "OPA",
              "ORIGIN",
              "PASEO",
              "PASSO",
              "PICKUP",
              "PICNIC",
              "PIXIS",
              "PLATZ",
              "PORTE",
              "PREMIO",
              "PREVIA",
              "PRIUS",
              "PROBOX",
              "PROGRES",
              "PRONARD",
              "PUBLICA",
              "QUALIS",
              "QUICK",
              "RACTIS",
              "RAIZE",
              "RAUM",
              "RAV4",
              "REGIUS",
              "REIZ",
              "ROOMY",
              "RUKUS",
              "RUMION",
              "RUSH",
              "SAI",
              "SCEPTER",
              "SCION",
              "SEQUOIA",
              "SERA",
              "SIENNA",
              "SIENTA",
              "SOARER",
              "SOLARA",
              "SOLUNA",
              "SPACIO",
              "SPADE",
              "SPARKY",
              "SPRINTER",
              "STARLET",
              "STOUT",
              "SUCCEED",
              "SUPRA",
              "T.U.V",
              "T100",
              "TACOMA",
              "TANK",
              "TARAGO",
              "TERCEL",
              "TOURING HIACE",
              "TOWN",
              "TOYO",
              "TUNDRA",
              "URBAN CRUISER",
              "URBANCRUISER",
              "URBANCRUISERHYRYDER",
              "VAN",
              "VANGUARD",
              "VELLFIRE",
              "VELOZ",
              "VENZA",
              "VEROSSA",
              "VERSO",
              "VERSO-S",
              "VIOS",
              "VISTA",
              "VITZ",
              "VOLTZ",
              "VOXY",
              "WIGO",
              "WILDLANDER",
              "WILL",
              "WINDOM",
              "WISH",
              "XA",
              "YARIS",
              "YARISATIV",
              "ZELAS"
              ],

      "Volkswagen": [
              "181",
              "AMEO",
              "APOLLO",
              "ARTEON",
              "ARTEON SHOOTING BRAKE",
              "ATLANTIC",
              "ATLAS/TERAMONT",
              "BEETLE",
              "BORA",
              "BRASILIA",
              "C-TREK",
              "CABRIO T",
              "CABRIOLET",
              "CADDY LIFE",
              "CARAT",
              "CARIBE",
              "CIRI GOLF",
              "CLASICO",
              "CORRADO",
              "CORSAR",
              "COUNTRY BUGGY",
              "DASHER",
              "DERBY",
              "EOS",
              "FOX",
              "GOL",
              "GOLF PLUS",
              "GOLF SPORTSVAN",
              "GOLF VARIANT/ SPORTSWAGEN",
              "GACEL",
              "HEBMULLER CABRIOLET",
              "ILTIS",
              "ID.4",
              "ID.5",
              "ID.6",
              "ID.7",
              "ID.BUZZ",
              "JETTA/SAGUITAR/VENTO",
              "KARMANN GHIA",
              "KOMMANDEURSWAGEN",
              "KUBELWAGEN",
              "K70",
              "LAMANDO",
              "LAVIDA",
              "LOGUS",
              "LUPO",
              "MAGOTAN",
              "MULTIVAN",
              "NEW BEETLE",
              "PARATI",
              "PASSAT",
              "PASSAT (CHINA)",
              "PASSAT LINGYU",
              "PHAETON",
              "PHIDEON",
              "POINTER",
              "POLO PLAYA",
              "POLO (RUSSIA)",
              "POLO TRACK",
              "POLO",
              "PORSCHE 914",
              "QUANTUM",
              "RABBIT",
              "ROUTAN",
              "SANTANA",
              "SCIROCCO",
              "SHARAN",
              "SURAN/SPACEFOX",
              "TAIGO/NIVUS",
              "TALAGON",
              "TAOS/THARU",
              "TAVENDOR",
              "TAYRON",
              "TAYRON-X",
              "TARO",
              "T-CROSS/TACQUA/TAIGUN",
              "T-ROC",
              "TIGUAN ALLSPACE",
              "TIGUAN-X",
              "TOURAN",
              "TOUAREG",
              "TYPE 1",
              "TYPE 3",
              "TYPE 4",
              "TYPE 18A",
              "TYPE 147 KLEINLIEFERWAGEN",
              "UP",
              "VENTO",
              "VIRTUS/POLO SEDAN/LAVIDA XR",
              "VILORAN",
              "VOYAGE",
              "XL1"
      ]
        // Add more brands and models as needed
    };
  
const form = document.getElementById('uploadForm');
let uploadedFiles = [];
let isEditing = false;

// Function to update the models dropdown based on the selected brand
function updateModels() {
  const brandSelect = document.getElementById("brand");
  const modelSelect = document.getElementById("model");
  const preFilledModel = modelSelect.dataset.preFill; // Get pre-filled model from data attribute

  // Clear existing options in the model dropdown
  modelSelect.innerHTML = "";

  // Add a default or placeholder option to the models dropdown
  const defaultOption = document.createElement("option");
  defaultOption.text = "Select a model";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  modelSelect.add(defaultOption);

  // Get the selected brand
  const selectedBrand = brandSelect.value;

  // Populate the model dropdown with options based on the selected brand
  (carData[selectedBrand] || []).forEach(model => {
      const option = document.createElement("option");
      option.value = model;
      option.text = model;
      modelSelect.add(option);
  });

  // Set the model dropdown value to the pre-filled model if it exists
  if (preFilledModel) {
      modelSelect.value = preFilledModel;
  }
}

// Initialize the models dropdown when the page loads
window.onload = function() {
  // Trigger updateModels to set initial options and pre-fill
  updateModels();

  // Add event listener for brand change
  document.getElementById("brand").addEventListener("change", updateModels);
};

//For picture upload
document.getElementById('photo').addEventListener('change', handleFileSelect);
document.getElementById('gallery').addEventListener('change', handleFileSelect);
document.getElementById('uploadForm').addEventListener('submit', validateForm);

const maxImages = 4;

function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  
  // Add new files, but limit to 4 total
  uploadedFiles = [...uploadedFiles, ...files].slice(0, maxImages);
  
  updatePreviewSection();
  
  // Disable file inputs if 4 images are uploaded
  if (uploadedFiles.length >= maxImages) {
      document.getElementById('photo').disabled = true;
      document.getElementById('gallery').disabled = true;
  } else {
      document.getElementById('photo').disabled = false;
      document.getElementById('gallery').disabled = false;
  }
}

function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    
    // Add new files, but limit to 4 total
    uploadedFiles = [...uploadedFiles, ...files].slice(0, 4);
    
    updatePreviewSection();
}

function handleEdit(index) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', function(event) {
        const files = event.target.files;
        if (files.length > 0) {
            uploadedFiles[index] = files[0];
            updatePreviewSection();
        }
    });

    fileInput.click();
}

function handleDelete(index) {
    uploadedFiles.splice(index, 1);
    updatePreviewSection();
}

function validateForm(event) {
  const errorContainer = document.getElementById('errorContainer');

  if (uploadedFiles.length === 0) {
      errorContainer.textContent = 'Please upload at least one photo from the camera or gallery.';
      errorContainer.style.display = 'block';
      errorContainer.focus();

      // Scroll to the error message
      errorContainer.scrollIntoView({ behavior: 'smooth' });

      event.preventDefault(); // Prevent form submission
  }
}

// Utility function to clear the error message
function clearErrorMessage() {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.style.display = 'none';
  errorContainer.textContent = '';
}

// Attach the clearErrorMessage function to the input change events
document.getElementById('photo').addEventListener('change', clearErrorMessage);
document.getElementById('gallery').addEventListener('change', clearErrorMessage);


//AIUGYASUYAGAJGAGAG JAGAUIGA AGAGA
document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('uploadForm');
  const photoInput = document.getElementById('photo');
  const galleryInput = document.getElementById('gallery');
  const yearSelect = document.getElementById('year');
  const startYearSelect = document.getElementById('startYear');
  const endYearSelect = document.getElementById('endYear');
  const errorMessage = document.getElementById('error-message');

  const singleYearOption = document.getElementById('singleYearOption');
  const intervalYearOption = document.getElementById('intervalYearOption');
  const singleYearDiv = document.getElementById('singleYearDiv');
  const intervalYearDiv = document.getElementById('intervalYearDiv');
  const currentYear = new Date().getFullYear();  // Set current year dynamically


  // Populate the year dropdowns
  for (let year = currentYear; year >= startYear; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option.cloneNode(true));
      startYearSelect.appendChild(option.cloneNode(true));
      endYearSelect.appendChild(option.cloneNode(true));
  }

  function setPreFilledValues() {
      const preFilledYearOption = singleYearOption.dataset.preFill || 'single';
      if (preFilledYearOption === 'single') {
          singleYearOption.checked = true;
          singleYearDiv.style.display = 'block';
          intervalYearDiv.style.display = 'none';
      } else if (preFilledYearOption === 'interval') {
          intervalYearOption.checked = true;
          singleYearDiv.style.display = 'none';
          intervalYearDiv.style.display = 'block';
      }
  }

  // Initial setup on page load
  setPreFilledValues();

  // Event listeners to switch visibility based on user interaction
  singleYearOption.addEventListener('change', function() {
      singleYearDiv.style.display = this.checked ? 'block' : 'none';
      intervalYearDiv.style.display = this.checked ? 'none' : 'block';
  });

  intervalYearOption.addEventListener('change', function() {
      singleYearDiv.style.display = this.checked ? 'none' : 'block';
      intervalYearDiv.style.display = this.checked ? 'block' : 'none';
  });
}); 

// Started the change from here

// Validation on form submission
form.addEventListener('submit', function(event) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = ''; // Clear any previous error messages

  // For selection of year
  const selectedYear = document.getElementById('year').value;
  const selectedStartYear = document.getElementById('startYear').value;
  const selectedEndYear = document.getElementById('endYear').value;

  // Validate year selection only if year selection options are involved
  if (singleYearOption.checked) {
      if (!selectedYear) {
          errorMessage.textContent = 'Please select a valid year.';
          event.preventDefault(); // Prevent form submission
          return;
      }
  } else if (intervalYearOption.checked) {
      if (!selectedStartYear || !selectedEndYear) {
          errorMessage.textContent = 'Please select a valid start year and end year.';
          event.preventDefault(); // Prevent form submission
          return;
      }
      if (selectedStartYear > selectedEndYear) {
          errorMessage.textContent = 'The start year cannot be greater than the end year.';
          event.preventDefault(); // Prevent form submission
          return;
      }
  }

  // If neither option is checked, allow form submission
  errorMessage.textContent = ''; // Clear any previous error messages
});

// Save form data to sessionStorage
function saveFormData() {
  const form = document.getElementById('uploadForm');
  const formData = new FormData(form);
  const formDataObject = {};

  formData.forEach((value, key) => {
      formDataObject[key] = value;
  });

  // Save uploaded files as data URLs
  const filePromises = uploadedFiles.map(file => 
      new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({
              name: file.name,
              type: file.type,
              dataUrl: reader.result
          });
          reader.onerror = reject;
          reader.readAsDataURL(file);
      })
  );

  Promise.all(filePromises).then(files => {
      formDataObject.uploadedFiles = files;
      sessionStorage.setItem('sellFormData', JSON.stringify(formDataObject));
  });
}

// Restore form data from sessionStorage
function restoreFormData() {
    const savedData = sessionStorage.getItem('sellFormData');
    if (savedData) {
        const formDataObject = JSON.parse(savedData);
        const form = document.getElementById('uploadForm');

        Object.keys(formDataObject).forEach(key => {
            if (key !== 'uploadedFiles') {
                const input = form.elements[key];
                if (input) {
                    input.value = formDataObject[key];
                }
            }
        });

        // Restore uploaded files
        if (formDataObject.uploadedFiles) {
            Promise.all(formDataObject.uploadedFiles.map(fileData => 
                fetch(fileData.dataUrl)
                    .then(res => res.blob())
                    .then(blob => new File([blob], fileData.name, { type: fileData.type }))
            )).then(files => {
                uploadedFiles = files;
                updatePreviewSection();
            });
        }

        // Clear the saved data after restoring
        sessionStorage.removeItem('sellFormData');
    }
}
  
 // Update preview section
function updatePreviewSection() {
    const previewSection = document.getElementById('preview-section');
    previewSection.innerHTML = '';

    uploadedFiles.forEach((file, index) => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.onload = () => URL.revokeObjectURL(img.src);
        imgContainer.appendChild(img);
        
        // Create Edit button
        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editButton.addEventListener('click', () => handleEdit(index));
        imgContainer.appendChild(editButton);
        
        // Create Delete button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteButton.addEventListener('click', () => handleDelete(index));
        imgContainer.appendChild(deleteButton);

        previewSection.appendChild(imgContainer);
    });

    // Update file input states
    document.getElementById('photo').disabled = uploadedFiles.length >= 4;
    document.getElementById('gallery').disabled = uploadedFiles.length >= 4;
}

// Function to initialize the form
function initializeForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    
    if (productId) {
        isEditing = true;
        fetchProductData(productId).catch(error => {
            console.error('Error fetching product data:', error);
            alert('Failed to fetch product data. Loading saved form data instead.');
            restoreFormData();
        });
    } else {
        restoreFormData();
    }
}

// Function to fetch product data when editing
function fetchProductData(productId) {
    return fetch(`/api/product/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(product => {
            populateForm(product);
            if (product.photos && Array.isArray(product.photos)) {
                loadProductImages(product.photos);
            }
        });
}

// Function to update LGA dropdown based on selected state
function updateLGAs() {
    const stateSelect = document.getElementById('lct');
    const lgaSelect = document.getElementById('lga');
    const preFilledLGA = lgaSelect.dataset.preFill; // Get pre-filled LGA from data attribute
    
    // Clear existing options in LGA dropdown
    lgaSelect.innerHTML = '<option value="">Select Local Government Area (LGA)</option>';
    
    // Get selected state
    const selectedState = stateSelect.value;
    
    // If a state is selected and exists in our mapping
    if (selectedState && statesAndLGAs[selectedState]) {
        // Add LGA options for selected state
        statesAndLGAs[selectedState].forEach(lga => {
            const option = document.createElement('option');
            option.value = lga;
            option.textContent = lga;
            
            // If this LGA matches the pre-filled value, select it
            if (preFilledLGA && preFilledLGA === lga) {
                option.selected = true;
            }
            
            lgaSelect.appendChild(option);
        });
    }
}

//Function to initialize location dropdowns
function initializeLocationDropdowns() {
    const stateSelect = document.getElementById('lct');
    
    // Add event listener for state change
    stateSelect.addEventListener('change', updateLGAs);
    
    // If there's a pre-selected state (editing mode), populate LGAs
    if (stateSelect.value && stateSelect.value !== 'Location') {
        updateLGAs();
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeLocationDropdowns();
});

// Function to populate form with product data
function populateForm(product) {
    const form = document.getElementById('uploadForm');
    
    // Populate basic fields
    Object.keys(product).forEach(key => {
        const input = form.elements[key];
        if (input && key !== 'photos' && key !== 'yearOption') {
            input.value = product[key];
        }
    });

    //Handle state and LGA specifically
    const stateSelect = document.getElementById('lct');
    const lgaSelect = document.getElementById('lga');
    
    if (product.state) {
        stateSelect.value = product.state;
    }
    
    if (product.lga) {
        lgaSelect.dataset.preFill = product.lga;
        // Trigger LGA update after setting state
        setTimeout(updateLGAs, 0);
    }

    // Handle year options
    if (product.yearOption === 'single') {
        document.getElementById('singleYearOption').checked = true;
        document.getElementById('year').value = product.year;
        document.getElementById('singleYearDiv').style.display = 'block';
        document.getElementById('intervalYearDiv').style.display = 'none';
    } else if (product.yearOption === 'interval') {
        document.getElementById('intervalYearOption').checked = true;
        document.getElementById('startYear').value = product.startYear;
        document.getElementById('endYear').value = product.endYear;
        document.getElementById('singleYearDiv').style.display = 'none';
        document.getElementById('intervalYearDiv').style.display = 'block';
    }

    // Handle boost option
    if (product.boostOption) {
        const boostOption = document.querySelector(`input[name="boostOption"][value="${product.boostOption}"]`);
        if (boostOption) boostOption.checked = true;
    }

    // Update any other specific fields as needed
}

// Function to load product images
function loadProductImages(imageUrls) {
    uploadedFiles = [];
    Promise.all(imageUrls.map(url => 
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
                return res.blob();
            })
            .then(blob => {
                const fileName = url.split('/').pop();
                return new File([blob], fileName, { type: blob.type });
            })
    )).then(files => {
        uploadedFiles = files;
        updatePreviewSection();
    }).catch(error => {
        console.error('Error loading images:', error);
        alert('Failed to load some images. You may need to re-upload them.');
    });
}

// Initialize the form when the page loads
window.addEventListener('DOMContentLoaded', initializeForm);

// Handle file selection
function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  
  // Add new files, but limit to 4 total
  uploadedFiles = [...uploadedFiles, ...files].slice(0, 4);
  
  updatePreviewSection();
  
  // Disable file inputs if 4 images are uploaded
  document.getElementById('photo').disabled = uploadedFiles.length >= 4;
  document.getElementById('gallery').disabled = uploadedFiles.length >= 4;
}


// Boost option selection handler
document.querySelectorAll('.boost-option').forEach(option => {
    option.addEventListener('click', function() {
        // Remove active class from all options
        document.querySelectorAll('.boost-option').forEach(opt => {
            opt.classList.remove('active');
        });
        
        // Add active class to clicked option
        this.classList.add('active');
        
        // Check the hidden radio button
        const radio = this.querySelector('input[type="radio"]');
        radio.checked = true;
        
        // Show popup only for paid options
        if (radio.value !== 'no-bst') {
            const modal = document.getElementById('popup-modal');
            const popupMessage = document.getElementById('popup-message');
            popupMessage.textContent = 'Payment gateway currently unavailable for this boost option.';
            modal.style.display = 'block';
        }
    });
});

// Add click handler for OK button
document.getElementById('ok-button').addEventListener('click', function() {
    document.getElementById('popup-modal').style.display = 'none';
    // Select free boost option after closing popup
    selectFreeBoost();
});

// Close modal when clicking outside and select free boost
window.addEventListener('click', function(event) {
    const modal = document.getElementById('popup-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
        // Select free boost option after closing popup
        selectFreeBoost();
    }
});

// Make sure the free boost option is selected by default when the page loads
window.addEventListener('DOMContentLoaded', function() {
    selectFreeBoost();
});

// Add validation for the location fields
function validateLocation() {
    const stateSelect = document.getElementById('lct');
    const lgaSelect = document.getElementById('lga');
    const errorContainer = document.getElementById('errorContainer');
    
    if (stateSelect.value === 'Location' || !stateSelect.value) {
        errorContainer.textContent = 'Please select a state';
        errorContainer.style.display = 'block';
        return false;
    }
    
    if (!lgaSelect.value) {
        errorContainer.textContent = 'Please select an LGA';
        errorContainer.style.display = 'block';
        return false;
    }
    
    return true;
}

//89764765360287238905738572089529--2808094723892389572352375-2395834-59834-9058-390908666666665-690890843-9608-4397869-7589-7407906
// Modify the form submission handler
document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Basic validation
    if (uploadedFiles.length !== 4) {
        alert('Please upload exactly 4 images.');
        return;
    }

    const formData = new FormData(this);
    
    // Always set boost option to no-bst regardless of what's selected
    formData.set('boostOption', 'no-bst');
    
    // Add uploaded files
    uploadedFiles.forEach(file => {
        formData.append('photos', file);
    });

    try {
        const response = await fetch('/submit-product', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        if (result.success) {
            // Set the modal message for success
            document.getElementById('modalMessage').innerText = result.message || 'Product submitted successfully. Review will be done within 24 hours.';
            document.getElementById('successModal').style.display = 'flex';
    
            // Redirect to '/my-shop' when OK button is clicked
            document.getElementById('okButton').addEventListener('click', () => {
                document.getElementById('successModal').style.display = 'none';
                window.location.href = '/my-shop';
            });
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
    } catch (error) {
        console.error('Error:', error);
    
        // Set the modal message for an error
        document.getElementById('modalMessage').innerText = 'There was a problem submitting the product. Please try again.';
        document.getElementById('successModal').style.display = 'flex';

        // Allow the user to dismiss the error modal
        document.getElementById('okButton').addEventListener('click', () => {
        document.getElementById('successModal').style.display = 'none';
    });
    }
});


// Make sure the free boost option is selected by default when the page loads
window.addEventListener('DOMContentLoaded', function() {
    const freeBoostOption = document.getElementById('no-bst');
    if (freeBoostOption) {
        const radio = freeBoostOption.querySelector('input[type="radio"]');
        radio.checked = true;
        freeBoostOption.classList.add('active');
    }
});

// Call restoreFormData when the page loads
//window.addEventListener('DOMContentLoaded', initializeForm);

// Add event listeners for file inputs
document.getElementById('photo').addEventListener('change', handleFileSelect);
document.getElementById('gallery').addEventListener('change', handleFileSelect);

// Modify the clearForm function
function clearForm() {
  document.getElementById('uploadForm').reset();
  uploadedFiles = [];
  document.getElementById('preview-section').innerHTML = '';
  document.getElementById('photo').disabled = false;
  document.getElementById('gallery').disabled = false;
  sessionStorage.removeItem('sellFormData');
}

// the new update End here

//OK button
document.getElementById('okButton').addEventListener('click', function() {
  document.getElementById('successModal').style.display = 'none';
  clearForm();
});

//Type mapping 
document.addEventListener('DOMContentLoaded', () => {
  const categorySelect = document.getElementById('category');
  const typeSelect = document.getElementById('type');

  console.log('Category Select:', categorySelect);
  console.log('Type Select:', typeSelect);

  const typeMapping = {
    engine: [
        "Alternator","Blower Motor","Belts","Camshaft","Camshaft Sensor","Clutch","Crankshaft","Crankshaft Sensor","Cylinder Head","Cylinder Head Gasket","Engine Block","EGR Valve","Exhaust Manifold","Flywheel","Fuel Injector","Fuel Pump","Full Engine","Gasket and Seals","Half Engine","Intake Manifold","Intercooler","Oil Cooler","Oil Filter","Oil Pump","Oil Sump (Oil Pan)","Piston","PCV Valve","Radiator","Throttle Body","Timing Belt","Timing Chain","Turbocharger",
        "Turbo Wastegate","Valve","Valve Lifters","Valve Springs","Water Pump","Others"
        ],
    electrical: [
        "Battery", "Fuse Boxes", "Ignition Coil", "Spark Plug", "Starter Motor", "Wiring Harness", "Alternator", "Voltage Regulator", "Regulator/Rectifier", 
        "Battery Charger", "Electronic Control Unit (ECU)", "Fuses and Relays", "Headlights/Taillights", "Turn Signal Switch", "Wiper Motor", "Sensors", 
        "Central Locking System", "Airbag Control Module", "ABS Module", "Power Window Motor", "Power Seat Motors", "Climate Control Sensors and Controls", 
        "Blower Resistor", "Relay", "Others"
        ],
    body: [
        "Bumper", "Door", "Fender", "Grille", "Hood", "Mirror", "Roof Racks", "Tailgate", "Trunk", "Window", "Wiper", "Windshield", "Quarter Panel", "Side Skirts", 
        "Sunroof", "Headlights", "Taillights", "Door Handle", "Side Mirrors", "License Plate Holder", "Exhaust Tip", "Others"
        ],
    suspension: [
        "Ball Joint", "Control Arm", "Shock Absorber", "Strut", "Suspension Spring", "Tie Rod Ends", "Wheel Bearing", "Sway Bar", "Power Steering Pumps", "Steering Rack", "Steering Column", "Upper/Lower A-Arm", "Bushings", "Coil Spring", "Leaf Spring", "Track Bar", "Radius Arm", "Stabilizer Link", "Suspension Mount", 
        "Shock Mount", "Others"
        ],
    braking: [
        "Brake Caliper", "Brake Disc", "Brake Drum", "Brake Line", "Brake Pad", "Brake Rotor", "Master Cylinder", "Brake Booster", "Brake Fluid Reservoir", 
        "Brake Proportioning Valve", "Brake Hose", "Wheel Cylinder", "Parking Brake Cable", "ABS Sensor", "ABS Control Module", "Brake Pedal", "Brake Shoe", 
        "Drum Brake Assembly", "Others"
        ],
    transmission: [
        "Axle", "Clutch", "Differential", "Driveshaft", "Flywheel", "Gearbox", "Transmission Filter", "CV Joints", "Transmission Cooler", "Shifter", 
        "Torque Converter", "Transmission Mount", "Synchronizer", "Overdrive", "Shift Linkage", "Transfer Case", "Transmission Fluid Pump", "Park Lock Mechanism", 
        "Others"
        ],
    exhaust: [
        "Catalytic Converter", "Exhaust Manifold", "Muffler", "Oxygen Sensor", "Tailpipe", "Exhaust Pipe", "Resonator", "Exhaust Flex Pipe", "Exhaust Clamp", 
        "Exhaust Hanger", "Downpipe", "Up-pipe", "Exhaust Shield", "Turbo Downpipe", "Exhaust Tip", "EGR Valve", "Others"
        ],
    fuel: [
        "Carburetor", "Fuel Filter", "Fuel Injector", "Fuel Line", "Fuel Pump", "Fuel Tank", "Fuel Pressure Regulator", "Fuel Rail", "Fuel Tank Cap", 
        "Fuel Sending Unit", "Fuel Gauge Sensor", "Fuel Return Line", "Fuel Shut-off Valve", "Fuel Filler Neck", "Fuel Filter Housing", "Fuel Filter Element", 
        "Fuel Vapor Canister", "Others"
        ],
    cooling: [
        "Coolant", "Fan Clutch", "Radiator", "Thermostat", "Water Pump", "Cooling Fan", "Radiator Cap", "Radiator Hose", "Coolant Reservoir", "Coolant Temperature Sensor", "Cooling System Pressure Tester", "Condenser", "Intercooler", "Expansion Tank", "Overflow Tank", "Shroud", "Auxiliary Cooling Fan", "Timing Belt Tensioner", "Others"
        ],
    climate: [
        "Air Conditioner", "Blower Motor", "Compressor", "Condenser", "Evaporator", "Heater Core", "HVAC Control Unit", "Climate Control Sensors", "Expansion Valve", 
        "Receiver-Drier", "Evaporator Core", "Cabin Air Filter", "Thermostat", "Defrost Duct", "Air Mix Door", "Blend Door Actuator", "AC Condenser Fan", 
        "HVAC Blower Motor Resistor", "Pressure Switch", "Air Intake Duct", "Others"
        ],
    interior: [
        "Dashboard", "Door Panel", "Floor Mat", "Headliner", "Seat", "Steering Wheel", "Center Console", "Seat Belt", "Air Bag", "Carpet", "Sun Visor", "Interior Trim", "Instrument Cluster", "Armrest", "Shifter", "Seat Cushion", "Seat Back", "Door Handle", "Window Switch", "Climate Control Vents", "Rearview Mirror", 
        "Side Mirror Adjuster", "Glove Box","Interior Lights", "Sunroof Switch", "Auxiliary Power Outlet", "Cup Holder", "Cargo Liner", "Others"
        ],
    lighting: [
        "Fog Light", "Headlight", "Indicator", "License Plate Light", "Tail Light", "Interior Lighting", "Brake Light", "Turn Signal", "Daytime Running Light (DRL)", 
        "High Beam", "Low Beam", "Headlight Bulb", "Tail Light Bulb", "Parking Light", "Side Marker Light", "Reverse Light", "Cabin Dome Light", "Fog Light Bulb", "Hazard Lights", "Reading Lights", "Trunk Light", "License Plate Light Bulb", "Others"
        ],
    tires: [
        "Tire", "Rim", "Wheel", "Wheel Hub", "Wheel Bearing", "Tire Pressure Monitoring System (TPMS)", "Wheel Lug Nut", "Valve Stem", "Tire Tread", "Wheel Spacer", 
        "Hubcap", "Center Cap", "Wheel Lock", "Run-Flat Tire", "Spare Tire", "Tire Patch", "Tire Sealant", "Bead Sealer", "Tire Mounting", "Others"
        ],
    fluids: [
        "Brake Fluid", "Coolant/Antifreeze", "Power Steering Fluid", "Grease and Lubricants", "Engine Oil", "Transmission Fluid", "Windshield Washer Fluid", 
        "Rear Differential Fluid", "Front Differential Fluid", "Gear Oil", "Hydraulic Fluid", "Fuel Additives", "AdBlue/DEF (Diesel Exhaust Fluid)", "Clutch Fluid", 
        "Radiator Stop Leak", "Battery Electrolyte", "Shock Absorber Fluid", "Air Conditioning Refrigerant", "Transmission Fluid Additive", "Engine Flush", "Others"
        ],
    performance: [
        "Cold Air Intake", "Exhaust System", "Performance Chip", "Suspension Kit", "Turbocharger", "Supercharger", "Performance Air Filter", "Intercooler", 
        "Performance Fuel Injector", "Performance Camshaft", "High-Flow Fuel Pump", "Upgraded Radiator", "Short Throw Shifter", "Lightweight Flywheel", 
        "High-Performance Brake Pads", "Performance Coilovers", "Performance Timing Belt", "Upgraded Throttle Body", "Performance Spark Plugs", "Aluminum Driveshaft", 
        "Performance Tires", "Performance Clutch", "Oil Catch Can", "Performance Battery", "Performance Exhaust Headers", "Cold Charge Pipe", "Others"
        ],
    accessories: [
        "Car Cover", "Floor Mat", "Phone Mount", "Roof Rack", "Seat Cover", "Steering Cover", "Sun Shade", "Dashboard Camera", "Trunk Organizer", "Air Freshener", 
        "Bluetooth Adapter", "Phone Charger", "GPS Unit", "Tire Pressure Monitor", "Backup Camera", "Car Vacuum", "Cup Holder", "First Aid Kit", "Emergency Road Kit", 
        "Portable Jump Starter", "Portable Air Compressor", "LED Light Strips", "Sun Visor Organizer", "Pet Seat Cover", "Window Tint", "Car Detailing Kit", 
        "Wheel Locks", "Custom Seat Belt Pads", "License Plate Frame", "Handheld Vacuum", "Key Finder", "Sunroof Deflector", "Custom Floor Mats", "Car Seat Protector", "Others"
        ],
    tools: [
        "Diagnostic Tools", "Jacks and Lifts", "Hand Tools", "Power Tools", "Cleaning Equipment", "Torque Wrench", "Impact Wrench", "Socket Set", "Wrenches", "Screwdrivers", "Drill", "Ratcheting Set", "Plier Set", "Breaker Bar", "Flashlight", "Car Lift", "Lift Pads", "Battery Tester", "Compression Tester", "Hydraulic Press", "Welder", "Air Compressor", "Grease Gun", "Shop Vac", "Fender Covers", "Automotive Creeper", "Brake Bleeder Kit", "Engine Hoist", "Torque Angle Gauge", "Oil Filter Wrench", "Multimeter", "Flare Nut Wrench", "Engine Stand", "Others"
        ]
  };

  function updateTypes() {
      const selectedCategory = categorySelect.value;
      console.log('Selected Category:', selectedCategory);

      const types = typeMapping[selectedCategory] || [];
      console.log('Types for selected category:', types);

      // Clear the current options in the type select element
      typeSelect.innerHTML = '<option value="">Select a type</option>';

      // Populate the type select element with the relevant types
      types.forEach(type => {
          const option = document.createElement('option');
          option.value = type;
          option.textContent = type;
          typeSelect.appendChild(option);
      });

      console.log('Type Select after population:', typeSelect.innerHTML);
  }

  // Initialize the types dropdown and handle category change
  if (categorySelect && typeSelect) {
      updateTypes();
      categorySelect.addEventListener('change', updateTypes);
      console.log('Event listener added to category select');
  } else {
      console.error('Category or Type select element not found');
  }
});

//Boost select handling
document.addEventListener('DOMContentLoaded', () => {
  const boostOptions = document.querySelectorAll('.boost-option');

  boostOptions.forEach(option => {
      option.addEventListener('click', () => {
          // Remove active class from all boost options
          boostOptions.forEach(opt => opt.classList.remove('active'));
          
          // Add active class to the clicked option
          option.classList.add('active');

          // Set the value of the hidden boost input field
          boostInput.value = option.getAttribute('data-boost');
      });
  });

});

//To comma the price input
const priceInput = document.getElementById('priceInput');

priceInput.addEventListener('input', function (e) {
  // Remove any non-digit characters, except for commas
  let value = this.value.replace(/,/g, '');

  // Convert the string to a number and format it with commas
  value = Number(value).toLocaleString('en');

  // Set the formatted value back to the input
  this.value = value;
});

function isNumberKey(evt) {
    // Allow only numbers and decimal point
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function validatePrice(input) {
    // Remove any non-numeric characters except decimal point
    let value = input.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // If value is empty or NaN, set to empty string
    if (value === '' || isNaN(value)) {
        input.value = '';
        return;
    }
    
    // Format the number with 2 decimal places if it contains a decimal point
    if (value.includes('.')) {
        value = parseFloat(value).toFixed(2);
    }
    
    input.value = value;
}


//Location Mapping
const statesAndLGAs = {
      Abia: [
          'Aba North', 'Aba South', 'Arochukwu', 'Bende', 'Ikwuano', 'Isiala Ngwa North', 
          'Isiala Ngwa South', 'Isuikwuato', 'Obi Ngwa', 'Ohafia', 'Osisioma', 'Ugwunagbo', 
          'Ukwa East', 'Ukwa West', 'Umuahia North', 'Umuahia South', 'Umu Nneochi'
      ],
      Adamawa: [
          'Demsa', 'Fufore', 'Ganye', 'Gayuk', 'Gombi', 'Grie', 'Hong', 'Jada', 'Lamurde', 
          'Madagali', 'Maiha', 'Mayo Belwa', 'Michika', 'Mubi North', 'Mubi South', 
          'Numan', 'Shelleng', 'Song', 'Toungo', 'Yola North', 'Yola South'
      ],
      'Akwa Ibom': [
          'Abak', 'Eastern Obolo', 'Eket', 'Esit Eket', 'Essien Udim', 'Etim Ekpo', 'Etinan', 
          'Ibeno', 'Ibesikpo Asutan', 'Ibiono Ibom', 'Ika', 'Ikono', 'Ikot Abasi', 'Ikot Ekpene', 
          'Ini', 'Itu', 'Mbo', 'Mkpat Enin', 'Nsit Atai', 'Nsit Ibom', 'Nsit Ubium', 'Obot Akara', 
          'Okobo', 'Onna', 'Oron', 'Oruk Anam', 'Udung Uko', 'Ukanafun', 'Uruan', 'Urue-Offong/Oruko', 
          'Uyo'
      ],
      Anambra: [
          'Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 'Awka South', 
          'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 'Idemili South', 'Ihiala', 
          'Njikoka', 'Nnewi North', 'Nnewi South', 'Ogbaru', 'Onitsha North', 'Onitsha South', 
          'Orumba North', 'Orumba South', 'Oyi'
      ],
      Bauchi: [
          'Alkaleri', 'Bauchi', 'Bogoro', 'Damban', 'Darazo', 'Dass', 'Gamawa', 'Ganjuwa', 
          'Giade', 'Itas Gadau', 'Jama\'are', 'Katagum', 'Kirfi', 'Misau', 'Ningi', 'Shira', 
          'Tafawa Balewa', 'Toro', 'Warji', 'Zaki'
      ],
      Bayelsa: [
          'Brass', 'Ekeremor', 'Kolokuma Opokuma', 'Nembe', 'Ogbia', 'Sagbama', 'Southern Ijaw', 
          'Yenagoa'
      ],
      Benue: [
          'Ado', 'Agatu', 'Apa', 'Buruku', 'Gboko', 'Guma', 'Gwer East', 'Gwer West', 'Katsina-Ala', 
          'Konshisha', 'Kwande', 'Logo', 'Makurdi', 'Obi', 'Ogbadibo', 'Ohimini', 'Oju', 'Okpokwu', 
          'Otukpo', 'Tarka', 'Ukum', 'Ushongo', 'Vandeikya'
      ],
      Borno: [
          'Abadam', 'Askira Uba', 'Bama', 'Bayo', 'Biu', 'Chibok', 'Damboa', 'Dikwa', 
          'Gubio', 'Guzamala', 'Gwoza', 'Hawul', 'Jere', 'Kaga', 'Kala Balge', 'Konduga', 
          'Kukawa', 'Kwaya Kusar', 'Mafa', 'Magumeri', 'Maiduguri', 'Marte', 'Mobbar', 
          'Monguno', 'Ngala', 'Nganzai', 'Shani'
      ],
      'Cross River': [
          'Abi', 'Akamkpa', 'Akpabuyo', 'Bakassi', 'Bekwarra', 'Biase', 'Boki', 'Calabar Municipal', 
          'Calabar South', 'Etung', 'Ikom', 'Obanliku', 'Obubra', 'Obudu', 'Odukpani', 'Ogoja', 
          'Yakuur', 'Yala'
      ],
      Delta: [
          'Aniocha North', 'Aniocha South', 'Bomadi', 'Burutu', 'Ethiope East', 'Ethiope West', 
          'Ika North East', 'Ika South', 'Isoko North', 'Isoko South', 'Ndokwa East', 'Ndokwa West', 
          'Okpe', 'Oshimili North', 'Oshimili South', 'Patani', 'Sapele', 'Udu', 'Ughelli North', 
          'Ughelli South', 'Ukwuani', 'Uvwie', 'Warri North', 'Warri South', 'Warri South West'
      ],
      Ebonyi: [
          'Abakaliki', 'Afikpo North', 'Afikpo South', 'Ebonyi', 'Ezza North', 'Ezza South', 
          'Ikwo', 'Ishielu', 'Ivo', 'Izzi', 'Ohaozara', 'Ohaukwu', 'Onicha'
      ],
      Edo: [
          'Akoko-Edo', 'Egor', 'Esan Central', 'Esan North-East', 'Esan South-East', 
          'Esan West', 'Etsako Central', 'Etsako East', 'Etsako West', 'Igueben', 'Ikpoba-Okha', 
          'Oredo', 'Orhionmwon', 'Ovia North-East', 'Ovia South-West', 'Owan East', 'Owan West', 
          'Uhunmwonde'
      ],
      Ekiti: [
          'Ado Ekiti', 'Efon', 'Ekiti East', 'Ekiti South-West', 'Ekiti West', 'Emure', 
          'Gbonyin', 'Ido Osi', 'Ijero Ekiti', 'Ikere Ekiti', 'Ikole', 'Ilejemeje', 'Irepodun-Ifelodun', 
          'Ise-Orun', 'Moba', 'Oye'
      ],
      Enugu: [
          'Aninri', 'Awgu', 'Enugu East', 'Enugu North', 'Enugu South', 'Ezeagu', 'Igbo Etiti', 
          'Igbo Eze North', 'Igbo Eze South', 'Isi Uzo', 'Nkanu East', 'Nkanu West', 'Nsukka', 
          'Oji River', 'Udenu', 'Udi', 'Uzo Uwani'
      ],
      Gombe: [
          'Akko', 'Balanga', 'Billiri', 'Dukku', 'Funakaye', 'Gombe', 'Kaltungo', 'Kwami', 
          'Nafada', 'Shongom', 'Yamaltu-Deba'
      ],
      Imo: [
          'Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North', 
          'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu', 'Mbaitoli', 
          'Ngor Okpala', 'Njaba', 'Nkwerre', 'Nwangele', 'Obowo', 'Oguta', 'Ohaji/Egbema', 
          'Okigwe', 'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal', 
          'Owerri North', 'Owerri West'
      ],
      Jigawa: [
          'Auyo', 'Babura', 'Biriniwa', 'Birnin Kudu', 'Buji', 'Dutse', 'Gagarawa', 
          'Garki', 'Gumel', 'Guri', 'Gwaram', 'Gwiwa', 'Hadejia', 'Jahun', 'Kafin Hausa', 
          'Kaugama', 'Kazaure', 'Kiri Kasama', 'Kiyawa', 'Maigatari', 'Malam Madori', 
          'Miga', 'Ringim', 'Roni', 'Sule Tankarkar', 'Taura', 'Yankwashi'
      ],
      Kaduna: [
          'Birnin Gwari', 'Chikun', 'Giwa', 'Igabi', 'Ikara', 'Jaba', 'Jema\'a', 'Kachia', 
          'Kaduna North', 'Kaduna South', 'Kagarko', 'Kajuru', 'Kaura', 'Kauru', 'Kubau', 
          'Kudan', 'Lere', 'Makarfi', 'Sabon Gari', 'Sanga', 'Soba', 'Zangon Kataf', 'Zaria'
      ],
      Kano: [
          'Ajingi', 'Albasu', 'Bagwai', 'Bebeji', 'Bichi', 'Bunkure', 'Dala', 'Dambatta', 
          'Dawakin Kudu', 'Dawakin Tofa', 'Doguwa', 'Fagge', 'Gabasawa', 'Garko', 'Garun Mallam', 
          'Gaya', 'Gezawa', 'Gwale', 'Gwarzo', 'Kabo', 'Kano Municipal', 'Karaye', 'Kibiya', 
          'Kiru', 'Kumbotso', 'Kunchi', 'Kura', 'Madobi', 'Makoda', 'Minjibir', 'Nasarawa', 
          'Rano', 'Rimin Gado', 'Rogo', 'Shanono', 'Sumaila', 'Takai', 'Tarauni', 'Tofa', 'Tsanyawa', 
          'Tudun Wada', 'Ungogo', 'Warawa', 'Wudil'
      ],
      Katsina: [
          'Bakori', 'Batagarawa', 'Batsari', 'Baure', 'Bindawa', 'Charanchi', 'Dandume', 
          'Danja', 'Dan Musa', 'Daura', 'Dutsi', 'Dutsin Ma', 'Faskari', 'Funtua', 'Ingawa', 
          'Jibia', 'Kafur', 'Kaita', 'Kankara', 'Kankia', 'Katsina', 'Kurfi', 'Kusada', 'Mai\'Adua', 
          'Malumfashi', 'Mani', 'Mashi', 'Matazu', 'Musawa', 'Rimi', 'Sabuwa', 'Safana', 'Sandamu', 
          'Zango'
      ],
      Kebbi: [
          'Aleiro', 'Arewa Dandi', 'Argungu', 'Augie', 'Bagudo', 'Birnin Kebbi', 'Bunza', 
          'Dandi', 'Fakai', 'Gwandu', 'Jega', 'Kalgo', 'Koko/Besse', 'Maiyama', 'Ngaski', 
          'Sakaba', 'Shanga', 'Suru', 'Wasagu/Danko', 'Yauri', 'Zuru'
      ],
      Kogi: [
          'Adavi', 'Ajaokuta', 'Ankpa', 'Bassa', 'Dekina', 'Ibaji', 'Idah', 'Igalamela-Odolu', 
          'Ijumu', 'Kabba/Bunu', 'Kogi', 'Lokoja', 'Mopa-Muro', 'Ofu', 'Ogori/Magongo', 
          'Okehi', 'Okene', 'Olamaboro', 'Omala', 'Yagba East', 'Yagba West'
      ],
      Kwara: [
          'Asa', 'Baruten', 'Edu', 'Ekiti', 'Ifelodun', 'Ilorin East', 'Ilorin South', 
          'Ilorin West', 'Irepodun', 'Isin', 'Kaiama', 'Moro', 'Offa', 'Oke Ero', 'Oyun', 'Pategi'
      ],
      Lagos: [
          'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 
          'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 
          'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'
      ],
      Nasarawa: [
          'Akwanga', 'Awe', 'Doma', 'Karu', 'Keana', 'Keffi', 'Kokona', 'Lafia', 'Nasarawa', 
          'Nasarawa Egon', 'Obi', 'Toto', 'Wamba'
      ],
      Niger: [
          'Agaie', 'Agwara', 'Bida', 'Borgu', 'Bosso', 'Chanchaga', 'Edati', 'Gbako', 'Gurara', 
          'Katcha', 'Kontagora', 'Lapai', 'Lavun', 'Magama', 'Mariga', 'Mashegu', 'Mokwa', 'Moya', 
          'Paikoro', 'Rafi', 'Rijau', 'Shiroro', 'Suleja', 'Tafa', 'Wushishi'
      ],
      Ogun: [
          'Abeokuta North', 'Abeokuta South', 'Ado-Odo/Ota', 'Egbado North', 'Egbado South', 
          'Ewekoro', 'Ifo', 'Ijebu East', 'Ijebu North', 'Ijebu North East', 'Ijebu Ode', 
          'Ikenne', 'Imeko Afon', 'Ipokia', 'Obafemi Owode', 'Odeda', 'Odogbolu', 'Ogun Waterside', 
          'Remo North', 'Shagamu'
      ],
      Ondo: [
          'Akoko North-East', 'Akoko North-West', 'Akoko South-East', 'Akoko South-West', 
          'Akure North', 'Akure South', 'Ese Odo', 'Idanre', 'Ifedore', 'Ilaje', 'Ile Oluji/Okeigbo', 
          'Irele', 'Odigbo', 'Okitipupa', 'Ondo East', 'Ondo West', 'Ose', 'Owo'
      ],
      Osun: [
          'Aiyedaade', 'Aiyedire', 'Atakumosa East', 'Atakumosa West', 'Boluwaduro', 
          'Boripe', 'Ede North', 'Ede South', 'Egbedore', 'Ejigbo', 'Ife Central', 'Ife East', 
          'Ife North', 'Ife South', 'Ifedayo', 'Ifelodun', 'Ila', 'Ilesa East', 'Ilesa West', 
          'Irepodun', 'Irewole', 'Isokan', 'Iwo', 'Obokun', 'Odo Otin', 'Ola Oluwa', 'Olorunda', 
          'Oriade', 'Orolu', 'Osogbo'
      ],
      Oyo: [
          'Afijio', 'Akinyele', 'Atiba', 'Atisbo', 'Egbeda', 'Ibadan North', 'Ibadan North-East', 
          'Ibadan North-West', 'Ibadan South-East', 'Ibadan South-West', 'Ibarapa Central', 
          'Ibarapa East', 'Ibarapa North', 'Ido', 'Irepo', 'Iseyin', 'Itesiwaju', 'Iwajowa', 
          'Kajola', 'Lagelu', 'Ogbomosho North', 'Ogbomosho South', 'Ogo Oluwa', 'Olorunsogo', 
          'Oluyole', 'Ona Ara', 'Orelope', 'Ori Ire', 'Oyo East', 'Oyo West', 'Saki East', 'Saki West', 
          'Surulere'
      ],
      Plateau: [
          'Barkin Ladi', 'Bassa', 'Bokkos', 'Jos East', 'Jos North', 'Jos South', 'Kanam', 
          'Kanke', 'Langtang North', 'Langtang South', 'Mangu', 'Mikang', 'Pankshin', 'Qua\'an Pan', 
          'Riyom', 'Shendam', 'Wase'
      ],
      Rivers: [
          'Abua Odual', 'Ahoada East', 'Ahoada West', 'Akuku Toru', 'Andoni', 'Asari-Toru', 
          'Bonny', 'Degema', 'Eleme', 'Emohua', 'Etche', 'Gokana', 'Ikwerre', 'Khana', 'Obio-Akpor', 
          'Ogba-Egbema-Ndoni', 'Ogu–Bolo', 'Okrika', 'Omuma', 'Opobo–Nkoro', 'Oyigbo', 'Port Harcourt', 
          'Tai'
      ],
      Sokoto: [
          'Binji', 'Bodinga', 'Dange Shuni', 'Gada', 'Goronyo', 'Gudu', 'Gwadabawa', 'Illela', 
          'Kebbe', 'Kware', 'Rabah', 'Sabon Birni', 'Shagari', 'Silame', 'Sokoto North', 'Sokoto South', 
          'Tambuwal', 'Tangaza', 'Tureta', 'Wamako', 'Wurno', 'Yabo'
      ],
      Taraba: [
          'Ardo Kola', 'Bali', 'Donga', 'Gashaka', 'Gassol', 'Ibi', 'Jalingo', 'Karim Lamido', 
          'Kurmi', 'Lau', 'Sardauna', 'Takum', 'Ussa', 'Wukari', 'Yorro', 'Zing'
      ],
      Yobe: [
          'Bade', 'Bursari', 'Damaturu', 'Fika', 'Fune', 'Geidam', 'Gujba', 'Gulani', 'Jakusko', 
          'Karasuwa', 'Machina', 'Nangere', 'Nguru', 'Potiskum', 'Tarmuwa', 'Yunusari', 'Yusufari'
      ],
      Zamfara: [
          'Anka', 'Bakura', 'Birnin Magaji/Kiyaw', 'Bukkuyum', 'Bungudu', 'Chafe', 'Gummi', 
          'Gusau', 'Kaura Namoda', 'Maradun', 'Maru', 'Shinkafi', 'Talata Mafara', 'Zurmi'
      ]
  
};

// Get the dropdown elements
const stateDropdown = document.getElementById('lct');
const lgaDropdown = document.getElementById('lga');

// Function to populate LGAs based on selected state
stateDropdown.addEventListener('change', function () {
const selectedState = this.value;
const lgas = statesAndLGAs[selectedState] || []; // Get the LGAs or an empty array if none

// Clear the LGA dropdown
lgaDropdown.innerHTML = '<option disabled selected value="">Select Local Government Area (LGA)</option>';

// Populate the LGA dropdown
lgas.forEach(function (lga) {
  const option = document.createElement('option');
  option.value = lga;
  option.textContent = lga;
  lgaDropdown.appendChild(option);
});
});

// On page load, if a product exists, populate the LGA dropdown based on the selected state
window.addEventListener('DOMContentLoaded', function () {
const selectedState = stateDropdown.value;
if (selectedState && product && product.state === selectedState) {
  const lgas = statesAndLGAs[selectedState] || [];
  lgas.forEach(function (lga) {
    const option = document.createElement('option');
    option.value = lga;
    option.textContent = lga;
    if (product.lga === lga) {
      option.selected = true;
    }
    lgaDropdown.appendChild(option);
  });
}
});






