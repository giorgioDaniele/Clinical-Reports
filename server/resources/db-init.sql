BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "USERS" (
    ID        INTEGER PRIMARY KEY AUTOINCREMENT,
    email     VARCHAR(100),
    name      VARCHAR(100),
    password  VARCHAR(64),
    salt 	  VARCHAR(12));

CREATE TABLE IF NOT EXISTS "PAGES" (
    ID         INTEGER PRIMARY KEY AUTOINCREMENT,
    title	   VARCHAR(100),
    userId     INTEGER,
    creation_date       DATE,
    publication_date    DATE,
    FOREIGN KEY (userId) REFERENCES USERS(ID));

CREATE TABLE IF NOT EXISTS "CONTENTS" (
    ID         INTEGER PRIMARY KEY AUTOINCREMENT,
    pageId     INTEGER,
    media_type VARCHAR(10),
    payload    TEXT,
    FOREIGN KEY (pageId) REFERENCES PAGES(ID));

CREATE TABLE IF NOT EXISTS "ADMINS" (
    ID         INTEGER,
    FOREIGN KEY (ID) REFERENCES USERS(ID));


CREATE TABLE IF NOT EXISTS "WEBSITE" (ID INTEGER PRIMARY KEY AUTOINCREMENT,text TEXT);

/*************************************************************************/
/*************************** USERS ***************************************/
/*************************************************************************

	PWD:  balenablu
	HASH: 400359fdb6ee2ff796b3709c6bbdba82e359944461c5238dea7cc943d2a4ca64
	SALT: e2i23r9092'0

	PWD:  balenarossa
	HASH: 1c6f243cbbfe56e77a0287c1e92348b5cf1b0ef0e4d2885a194de7dc6e2e8863
	SALT: w4i ru rpq4a

	PWD:  balenaverde
	HASH: e2258d62a5d33374f4a683f84f5a664ef5c24c2fc82dfb70ce4f6620a3431aea
	SALT: wfe iwruplao

	PWD:  balenagialla
	HASH: c0001d91ca48ab18d2e12950039bdaf0cfa5179c7b4643487acc26ddd6079f82
	SALT: 24 uit24t24t

**************************************************************************/
/*************************** USERS ***************************************/
/*************************************************************************/

INSERT INTO "WEBSITE" VALUES (1, "Clinical Reports");

/* ID, EMAIL, NAME, HASH, SALT */
INSERT INTO "USERS" VALUES  (1, "balenablu@clinica.com",    "Balena Blu",   "400359fdb6ee2ff796b3709c6bbdba82e359944461c5238dea7cc943d2a4ca64", "e2i23r9092'0");
INSERT INTO "USERS" VALUES  (2, "balenarossa@clinica.com",  "Balena Rossa", "1c6f243cbbfe56e77a0287c1e92348b5cf1b0ef0e4d2885a194de7dc6e2e8863", "w4i ru rpq4a");
INSERT INTO "USERS" VALUES  (3, "balenaverde@clinica.com",  "Balena Verde", "e2258d62a5d33374f4a683f84f5a664ef5c24c2fc82dfb70ce4f6620a3431aea", "wfe iwruplao");
INSERT INTO "USERS" VALUES  (4, "balenagialla@clinica.com", "Balena Gialla","c0001d91ca48ab18d2e12950039bdaf0cfa5179c7b4643487acc26ddd6079f82", "24 uit24t24t");

INSERT INTO "ADMINS" VALUES  (1);
INSERT INTO "ADMINS" VALUES  (2);


/* ID, TITLE, USER ID, CREATION DATE, PUBLICATION DATE, CONTENT ID */
INSERT INTO "PAGES" VALUES (1,  "Influenza (Flu)", 1, DATE('2020-02-17'),  DATE('2020-02-18'));
INSERT INTO "PAGES" VALUES (2,  "Common Cold", 2, DATE('2020-07-05'),  DATE(NULL));
INSERT INTO "PAGES" VALUES (3,  "COVID-19 (Coronavirus)", 1, DATE('2020-11-29'),  DATE('2020-11-30'));
INSERT INTO "PAGES" VALUES (4,  "Pneumonia", 3, DATE('2020-07-05'),  DATE(NULL));
INSERT INTO "PAGES" VALUES (5,  "Diabetes", 4, DATE('2010-02-16'),  DATE('2011-02-19'));
INSERT INTO "PAGES" VALUES (6,  "Cancer", 1, DATE('2020-02-17'),  DATE('2020-02-18'));
INSERT INTO "PAGES" VALUES (7,  "Alzheimer's Disease", 4, DATE('2010-02-16'),  DATE('2011-02-19'));

/* ID, CONTENT ID, MEDIA-TYPE, PAYLOAD */
INSERT INTO "CONTENTS" VALUES (1, 1, "HEADER",
                               "Flu (influenza) is an infection of the nose,
                                throat and lungs, which are part of the respiratory system.
                                Influenza is commonly called the flu, but it's not the same as
                                stomach flu viruses that cause diarrhea and vomiting.");
INSERT INTO "CONTENTS" VALUES (2, 1, "TEXT",
                               "At first, the flu may seem like a common cold with a runny nose,
                               sneezing and sore throat. Colds usually develop slowly. But the flu tends
                               to come on suddenly. And while a cold can be miserable, you usually feel much worse with the flu.
                               Common symptoms of the flu include: Fever, Aching muscles, Chills and sweats, Headache, Dry, Persistent cough,
                               Shortness of breath, Tiredness and weakness, Runny or stuffy nose, Sore throat, Eye pain,
                               vomiting and Diarrhea, but this is more common in children than adults");
INSERT INTO "CONTENTS" VALUES (3, 1, "TEXT",
                               "Influenza viruses travel through the air in droplets when someone with the infection coughs,
                               sneezes or talks. You can inhale the droplets directly. Or you can pick up the germs from an object
                               — such as a telephone or computer keyboard — and then transfer them to your eyes, nose or mouth.
                               People with the virus are likely contagious from about a day before symptoms appear until about four
                               days after they start. Children and people with weakened immune systems may be contagious for a slightly longer time.
                               Influenza viruses are constantly changing, with new strains appearing regularly. If you''ve had influenza in the past,
                               your body has already made antibodies to fight that specific strain of the virus. If future influenza viruses are similar
                               to those you''ve encountered before, either by having the disease or by getting vaccinated, those antibodies
                               may prevent infection or lessen its severity. But antibody levels may decline over time.
                               Also, antibodies against influenza viruses you''ve encountered in the past may not protect you from new influenza strains.
                               New strains can be very different viruses from what you had before.");


INSERT INTO "CONTENTS" VALUES (4, 2, "HEADER",
                               "The common cold is an illness affecting your nose and throat. Most often, it's harmless,
                                but it might not feel that way. Germs called viruses cause a common cold.
                                Often, adults may have two or three colds each year. Infants and young children may have colds more often.
                                Most people recover from a common cold in 7 to 10 days. Symptoms might last longer in
                                people who smoke. Most often, you don''t need medical care for a common cold.
                                If symptoms don''t get better or if they get worse, see your health care provider.
                                Illnesses of the nose and throat caused by germs are called upper respiratory tract infections");
INSERT INTO "CONTENTS" VALUES (5, 2, "TEXT",
                               "More than 200 different viruses can cause a cold, but rhinoviruses are the most common type.
                                The viruses that cause colds are very contagious. They can spread from person to person through
                                the air and close personal contact. You can also get infected when you touch something that
                                has the virus on it and then touch your eyes, mouth, or nose. For example, you could get a cold
                                after you shake hands with someone who has a cold or touch a doorknob that has the germs on it,
                                and then touch your face.");
INSERT INTO "CONTENTS" VALUES (6, 2, "TEXT",
                               "Most people who have a cold will feel better after a week or two.
ù                               However, some people who get a cold may develop other illnesses, such as bronchitis or pneumonia.
                                This is more common in people with weakened immune systems, asthma, or other respiratory conditions.");



INSERT INTO "CONTENTS" VALUES (7, 3, "HEADER",
                               "Coronavirus disease (COVID-19) is an infectious disease caused by the SARS-CoV-2 virus.");
INSERT INTO "CONTENTS" VALUES (8, 3, "TEXT",
                               "Most people infected with the virus will experience mild to moderate respiratory illness
                                and recover without requiring special treatment. However, some will become seriously ill
                                and require medical attention. Older people and those with underlying medical conditions
                                like cardiovascular disease, diabetes, chronic respiratory disease, or cancer are more likely
                                to develop serious illness. Anyone can get sick with COVID-19 and become seriously ill or die at any age.

                                The best way to prevent and slow down transmission is to be well informed about the disease
                                and how the virus spreads. Protect yourself and others from infection by staying at least 1
                                metre apart from others, wearing a properly fitted mask, and washing your hands or using an
                                alcohol-based rub frequently. Get vaccinated when it’s your turn and follow local guidance.");
INSERT INTO "CONTENTS" VALUES (9, 3, "TEXT",
                               "The virus can spread from an infected person’s mouth or nose in small liquid particles when
                                they cough, sneeze, speak, sing or breathe. These particles range from larger respiratory
                                droplets to smaller aerosols. It is important to practice respiratory etiquette, for example
                                by coughing into a flexed elbow, and to stay home and self-isolate until you recover if you feel unwell.");


INSERT INTO "CONTENTS" VALUES (10, 4, "HEADER",
                               "Pneumonia is an infection caused by bacteria, viruses, or fungi. It leads to inflammation in
                                the air sacs of one or both lungs. These sacs, called alveoli, fill with fluid or pus, making
                                it difficult to breathe.");
INSERT INTO "CONTENTS" VALUES (11, 4, "TEXT",
                               "Pneumonia happens when germs get into your lungs and cause an infection. The immune system’s
                                reaction to clear the infection results in inflammation of the lung’s air sacs (alveoli).
                                This inflammation can eventually cause the air sacs to fill up with pus and liquids, causing pneumonia symptoms.");


INSERT INTO "CONTENTS" VALUES (12, 5, "HEADER",
                               "Diabetes is a chronic disease that occurs either when the pancreas does not produce enough
                                insulin or when the body cannot effectively use the insulin it produces. Insulin is a hormone
                                that regulates blood glucose. Hyperglycaemia, also called raised blood glucose or raised blood sugar,
                                is a common effect of uncontrolled diabetes and over time leads to serious damage to many of the body's
                                systems, especially the nerves and blood vessels.");
INSERT INTO "CONTENTS" VALUES (13, 5, "TEXT",
                               "In 2014, 8.5% of adults aged 18 years and older had diabetes. In 2019, diabetes was the direct
                                cause of 1.5 million deaths and 48% of all deaths due to diabetes occurred before the age of 70 years.
                                Another 460 000 kidney disease deaths were caused by diabetes, and raised blood glucose causes around 20% of cardiovascular deaths (1).

                                Between 2000 and 2019, there was a 3% increase in age-standardized mortality rates from diabetes.
                                In lower-middle-income countries, the mortality rate due to diabetes increased 13%. By contrast,
                                the probability of dying from any one of the four main noncommunicable diseases (cardiovascular diseases,
                                cancer, chronic respiratory diseases or diabetes) between the ages of 30 and 70 decreased by 22% globally
                                between 2000 and 2019. ");
INSERT INTO "CONTENTS" VALUES (14, 5, "TEXT",
                               "Early diagnosis can be accomplished through relatively inexpensive testing of blood glucose.
                                People with type 1 diabetes need insulin injections for survival.
                                One of the most important ways to treat diabetes is to keep a healthy lifestyle.");

INSERT INTO "CONTENTS" VALUES (15, 6, "HEADER",
                               "Cancer is a condition where cells in a specific part of the body grow and reproduce uncontrollably.
                                The cancerous cells can invade and destroy surrounding healthy tissue, including organs.");
INSERT INTO "CONTENTS" VALUES (16, 6, "TEXT",
                               "Tobacco use is the cause of about 22% of cancer deaths.[2] Another 10% are due to obesity,
                                poor diet, lack of physical activity or excessive drinking of alcohol.[2][8][9] Other factors
                                include certain infections, exposure to ionizing radiation, and environmental pollutants.[3]
                                In the developing world, 15% of cancers are due to infections such as Helicobacter pylori, hepatitis B,
                                hepatitis C, human papillomavirus infection, Epstein–Barr virus and human immunodeficiency virus (HIV).[2]
                                These factors act, at least partly, by changing the genes of a cell.[10] Typically, many
                                genetic changes are required before cancer develops.[10] Approximately 5–10% of cancers are due to
                                inherited genetic defects.[11] Cancer can be detected by certain signs and symptoms or screening tests.[2]
                                It is then typically further investigated by medical imaging and confirmed by biopsy.[12]");
INSERT INTO "CONTENTS" VALUES (17, 6, "TEXT",
                               "The risk of developing certain cancers can be reduced by not smoking, maintaining a healthy weight,
                                limiting alcohol intake, eating plenty of vegetables, fruits, and whole grains, eating resistant
                                starch,[13][14] vaccination against certain infectious diseases, limiting consumption of processed
                                meat and red meat, and limiting exposure to direct sunlight.[15][16] Early detection through screening
                                is useful for cervical and colorectal cancer.[17] The benefits of screening for breast cancer
                                are controversial.[17][18] Cancer is often treated with some combination of radiation therapy,
                                surgery, chemotherapy and targeted therapy.[2][4] Pain and symptom management are an important
                                part of care.[2] Palliative care is particularly important in people with advanced disease.[2]
                                The chance of survival depends on the type of cancer and extent of disease at the start of
                                treatment.[10] In children under 15 at diagnosis, the five-year survival rate in the developed
                                world is on average 80%.[19] For cancer in the United States, the average five-year survival
                                rate is 66% for all ages.[5]");

INSERT INTO "CONTENTS" VALUES (19, 7, "HEADER",
                               "Alzheimer's disease (AD) is a neurodegenerative disease that usually starts slowly and progressively
                                worsens.[2] It is the cause of 60–70% of cases of dementia.[2][11]
                                The most common early symptom is difficulty in remembering recent events.[1] As the disease advances,
                                symptoms can include problems with language, disorientation (including easily getting lost), mood swings,
ù                               loss of motivation, self-neglect, and behavioral issues.[2] As a person's condition declines,
                                they often withdraw from family and society.[12] Gradually, bodily functions are lost,
                                ultimately leading to death.[13] Although the speed of progression can vary, the typical
                                life expectancy following diagnosis is three to nine years.");
INSERT INTO "CONTENTS" VALUES (20, 7, "TEXT",
                               "The first symptoms are often mistakenly attributed to aging or stress.[26]
                                Detailed neuropsychological testing can reveal mild cognitive difficulties up to eight
                                years before a person fulfills the clinical criteria for diagnosis of Alzheimer''s disease.[27]
                                These early symptoms can affect the most complex activities of daily living.[28]
                                The most noticeable deficit is short term memory loss, which shows up as difficulty in
                                remembering recently learned facts and inability to acquire new information.[27]
                                Subtle problems with the executive functions of attentiveness, planning, flexibility,
                                and abstract thinking, or impairments in semantic memory (memory of meanings, and concept
                                relationships) can also be symptomatic of the early stages of Alzheimer's disease.[27]
                                Apathy and depression can be seen at this stage, with apathy remaining as the most persistent
                                symptom throughout the course of the disease.[29][30] Mild cognitive impairment (MCI) is often
                                found to be a transitional stage between normal aging and dementia. MCI can present with a variety
                                of symptoms, and when memory loss is the predominant symptom, it is termed amnestic MCI and is
                                frequently seen as a prodromal stage of Alzheimer''s disease.[31] Amnestic MCI has a greater than 90%
                                likelihood of being associated with Alzheimer's.");
INSERT INTO "CONTENTS" VALUES (21, 7, "TEXT",
                               "Proteins fail to function normally. This disrupts the work of the brain cells affected and triggers
                                a toxic cascade, ultimately leading to cell death and later brain shrinkage.[42]
                                Alzheimer's disease is believed to occur when abnormal amounts of amyloid beta (Aβ),
                                accumulating extracellularly as amyloid plaques and tau proteins, or intracellularly as
                                neurofibrillary tangles, form in the brain, affecting neuronal functioning and connectivity,
                                resulting in a progressive loss of brain function.[43][44] This altered protein clearance ability
                                is age-related, regulated by brain cholesterol,[45] and associated with other neurodegenerative diseases.[4]");


INSERT INTO "CONTENTS" VALUES (22, 1, "PHOTO", "colorful.jpg");
INSERT INTO "CONTENTS" VALUES (23, 2, "PHOTO", "meds.jpeg");
INSERT INTO "CONTENTS" VALUES (24, 3, "PHOTO", "meds_fall.jpg");
INSERT INTO "CONTENTS" VALUES (25, 4, "PHOTO", "meeds_spoon.jpg");
INSERT INTO "CONTENTS" VALUES (26, 2, "PHOTO", "pharmacy.jpg");
COMMIT;
