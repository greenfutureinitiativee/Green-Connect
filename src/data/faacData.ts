export interface StateFaacPool {
    state: string;
    totalLgaPool: number; // State Net Total for all its LGAs
    lgaCount: number;
}

export const march2026FaacPools: StateFaacPool[] = [
    { state: "Delta", totalLgaPool: 50.82, lgaCount: 25 },
    { state: "Akwa Ibom", totalLgaPool: 38.65, lgaCount: 31 },
    { state: "Kano", totalLgaPool: 22.74, lgaCount: 44 },
    { state: "Oyo", totalLgaPool: 19.28, lgaCount: 33 },
    { state: "Borno", totalLgaPool: 16.86, lgaCount: 27 },
    { state: "Jigawa", totalLgaPool: 16.50, lgaCount: 27 },
    { state: "Anambra", totalLgaPool: 15.94, lgaCount: 21 },
    { state: "Imo", totalLgaPool: 15.56, lgaCount: 27 },
    { state: "Benue", totalLgaPool: 15.17, lgaCount: 23 },
    { state: "Katsina", totalLgaPool: 14.90, lgaCount: 34 },
    { state: "Sokoto", totalLgaPool: 14.58, lgaCount: 23 },
    { state: "Kebbi", totalLgaPool: 14.58, lgaCount: 21 },
    { state: "Niger", totalLgaPool: 14.44, lgaCount: 25 },
    { state: "Adamawa", totalLgaPool: 14.13, lgaCount: 21 },
    { state: "Kogi", totalLgaPool: 13.81, lgaCount: 21 },
    { state: "Abia", totalLgaPool: 10.03, lgaCount: 17 },
    { state: "Kaduna", totalLgaPool: 12.49, lgaCount: 23 },
    { state: "Osun", totalLgaPool: 12.01, lgaCount: 30 },
    { state: "Lagos", totalLgaPool: 41.12, lgaCount: 20 }, 
];

export const individualLgaAllocations: Record<string, number> = {
    "Udung Uko": 0.38842,
    "Urue Offong/Oruko": 0.39518,
    "Dunukofia": 0.41420,
    "Obi": 0.43215,
    "Ohimini": 0.39844,
    "Tarka": 0.38348,
    "Bayo": 0.41012,
    "Kala/Balge": 0.42256,
    "Kwaya Kusar": 0.39690,
    "Shani": 0.40877,
    "Aniocha North": 0.44218,
    "Bomadi": 0.46835,
    "Oshimili North": 0.45590,
    "Patani": 0.42512,
    "Ukwuani": 0.44860,
    "Nkwerre": 0.40233,
    "Nwangele": 0.41570,
    "Obowo": 0.40922,
    "Onuimo": 0.38845,
    "Oru East": 0.42610,
    "Oru West": 0.41895,
    "Owerri West": 0.44005,
    "Dutse": 0.46210,
    "Gagarawa": 0.39245,
    "Hadejia": 0.43580,
    "Miga": 0.39812,
    "Roni": 0.38960,
    "Yankwashi": 0.37525,
    "Ikara": 0.44230,
    "Kagarko": 0.45815,
    "Makarfi": 0.43040,
    "Bebeji": 0.42563,
    "Bunkure": 0.41099,
    "Doguwa": 0.45348,
    "Fagge": 0.44427,
    "Garko": 0.41407,
    "Garun Malam": 0.41190,
    "Kusada": 0.38215,
    "Rimi": 0.41840,
    "Aliero": 0.39422,
    "Ogori/Magongo": 0.36280,
    "Tafa": 0.42010,
    "Wushishi": 0.41255,
    "Aiyedire": 0.38540,
    "Boluwaduro": 0.37012,
    "Ola-Oluwa": 0.38295,
    "Afijio": 0.41260,
    "Ido": 0.45530,
    "Oyo East": 0.43218,
    "Binji": 0.39840,
    "Yabo": 0.39512,
    "Mubi South": 0.44250,
    "Eastern Obolo": 0.39832,
    "Esit Eket": 0.40332,
    "Ibeno": 0.41962,
    "Ika": 0.41229,
    "Mbo": 0.43604,
    "Nsit Atai": 0.40530,
    "Nsit Ibom": 0.44628,
    "Okobo": 0.43010,
    "Oron": 0.44125
};

export const getLgaMarchAllocation = (lgaName: string, stateName: string): number => {
    if (individualLgaAllocations[lgaName]) {
        return individualLgaAllocations[lgaName];
    }
    const pool = march2026FaacPools.find(p => p.state === stateName);
    if (pool) {
        return (pool.totalLgaPool / pool.lgaCount);
    }
    return 0.586; 
};

export const isAllocationVerified = (lgaName: string): boolean => {
    return !!individualLgaAllocations[lgaName];
};
