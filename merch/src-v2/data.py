import json
SP='/tmp/claude-0/-home-user-DASHBOARD-CASE-STUDIES/573ba59d-e5f2-5406-845c-e9df8bbc9145/scratchpad'
P={p['key']:p for p in json.load(open(SP+'/places.json'))['places']}
MED=json.load(open(SP+'/place-media.json'))
ERAS=[('1930s–50s','#FFD54A'),('1960s','#FF9F43'),('1970s','#FF5C8A'),('1980s','#C07CFF'),('1990s','#4FA8FF'),('2000s–today','#3EE6C8')]
CH=[('Where the city danced','British-era ballrooms, clubs and theatres, all a short walk apart in the Cantonment, where dance bands played jazz and swing.'),
('Where the bands came from',"The city's first beat bands grew out of its schools. Duke Ellington played the Glass House in 1963."),
('Where the young hung out',"Koshy's, The Only Place and Gaylord: jams, swapped records and music talk over beers. Cabaret lit up MG Road."),
('Out in the open','Gigs in Cubbon Park, the free Music Strip stage, and rock pubs like Pecos and Take 5.'),
('Do it yourself',"Freedom Jam, the Strawberry Fields college fest and poolside “rock happenings” launched a new wave of Bangalore bands."),
('The world comes to Bangalore',"Deep Purple, the Stones, Iron Maiden and Metallica at Palace Grounds, Guns N' Roses at Bhartiya City, live music in Indiranagar.")]
# (key, decade, display name, why)
L=[('dance-6',0,None,"Wartime soldiers' dance hall"),('dance-3',0,None,'British-era pub on MG Road'),('dance-1',0,None,'British-era hotel dances'),
('dance-8',0,None,"Bruce Gabriel's big band"),('dance-9',0,None,'Eddie and his Rhythm Stars'),('dance-11',0,'BUS Club','Dances; Devil Beats, NYE 1968'),
('dance-4',0,None,'Theatre row, MG Road'),('dance-5',0,None,'Fans saw the Woodstock film here'),('dance-10',0,None,'Theatre row, Brigade Road'),
('dance-7',0,None,'The Spartans played here, 1969'),('dance-2',0,None,'Saraswathi Orchestra, 1943'),
('schools-1',1,"Bishop Cotton Boys'",'Biddu formed The Trojans here'),('schools-3',1,"Bishop Cotton Girls'",'School that fed the beat bands'),
('schools-4',1,"St Joseph's Boys'",'School that fed the beat bands'),('schools-6',1,'Cathedral High','School that fed the beat bands'),
('schools-7',1,'Sacred Heart Girls','School that fed the beat bands'),('schools-2',1,'Baldwin Girls','School that fed the beat bands'),
('schools-5',1,'Baldwin Boys','School that fed the beat bands'),('schools-8',1,"St Germain's",'School that fed the beat bands'),
('venues-23',1,'Glass House, Lalbagh','Duke Ellington, 3 October 1963'),('venues-3',1,None,'Sonorific Fantastic; a young Usha Uthup'),
('hangouts-1',2,None,'Jukebox, jams and music talk'),('hangouts-2',2,None,'Daytime acoustic jams'),('hangouts-5',2,None,'MG Road youth hangout'),
('hangouts-7',2,None,'A band every Sunday'),('hangouts-4',2,None,'Tiny restaurant turned rock venue'),('cabaret-2',2,None,'Cabaret and afternoon rock jams'),
('hangouts-6',2,'Stay Longer / Ramada','Golden Nugget, the hottest disco'),
('venues-10',3,None,'Gigs in the park'),('venues-12',3,None,'Regular concerts'),('venues-11',3,None,'Free open-air stage, 1983–86'),
('hangouts-9',3,'The Pub (later NASA)','The space-age rock pub'),('venues-9',3,None,'Retro rock, late-night jazz'),('hangouts-8',3,None,'Retro-rock pub, opened 1989'),
('venues-4',4,'Samsa','Freedom Jam, from 1996'),('venues-5',4,'NLSIU','Strawberry Fields college fest, 1997'),('venues-24',4,None,'Poolside “Rock Happening”, 1997'),
('venues-1',5,None,'Deep Purple to Metallica, 2001–11'),('venues-13',5,None,'Concerts and Kroaknights'),('venues-14',5,'Gandhi statue, MG Road','Protest at the 2005 live-music ban'),
('venues-2',5,None,"India's first, 2007, in the old HMV store"),('venues-6',5,None,'Live-music bar, 2009–18'),('venues-7',5,None,'Indie stage since 2013'),
('venues-25',5,None,"Guns N' Roses, 2012"),('venues-8',5,'Indian Music Experience','Rock in a music museum, 2019')]
assert len(L)==45 and len({k for k,*_ in L})==45
places=[]
for i,(k,e,nm,why) in enumerate(L):
    p=P[k]; m=MED.get(k) or []
    img=m[1] if k=='hangouts-1' else (m[0] if m else '')
    places.append(dict(n=i+1,key=k,e=e,name=nm or p['name'],why=why,lat=p['lat'],lng=p['lng'],img=img))
rng=[[min(q['n'] for q in places if q['e']==e),max(q['n'] for q in places if q['e']==e)] for e in range(6)]
json.dump(dict(ERAS=ERAS,CH=CH,RNG=rng,places=places,
  intro=["Before it was a tech city, Bangalore was Band-galore.","For ninety years its music moved through these streets: from colonial ballrooms to school stages, MG Road cafés and stadium gigs. Follow the photos from 1 to 45, oldest to newest, and the coloured pins to find each place."]),
  open(SP+'/v2/data.json','w'),ensure_ascii=False,indent=0)
print(rng)
