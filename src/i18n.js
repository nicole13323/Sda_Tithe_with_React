export const TR={};`app|SDA Tithe Management|Imicungire y'Icyacumi SDA|Usimamizi wa Zaka SDA|Gestion de la Dîme SDA
login|Login|Kwinjira|Ingia|Connexion
register|Register|Iyandikishe|Jisajili|S'inscrire
phone|Phone / Username|Telefoni / Izina|Simu / Jina la mtumiaji|Téléphone / Identifiant
password|Password|Ijambobanga|Nenosiri|Mot de passe
name|Full name|Amazina yombi|Jina kamili|Nom complet
church|Church|Itorero|Kanisa|Église
logout|Logout|Sohoka|Toka|Déconnexion
pay|Pay tithe|Tanga icyacumi|Toa zaka|Payer la dîme
hist|Payment history|Amateka y'ubwishyu|Historia ya malipo|Historique des paiements
amount|Amount (RWF)|Amafaranga (RWF)|Kiasi (RWF)|Montant (RWF)
method|Method|Uburyo|Njia|Méthode
total|Total|Igiteranyo|Jumla|Total
yr|This year|Uyu mwaka|Mwaka huu|Cette année
cnt|Payments|Ubwishyu|Malipo|Paiements
date|Date|Itariki|Tarehe|Date
rec|Receipt|Inyemezabwishyu|Risiti|Reçu
print|Print / Save PDF|Sohora / Bika PDF|Chapisha / Hifadhi PDF|Imprimer / PDF
close|Close|Funga|Funga|Fermer
rep|Reports|Raporo|Ripoti|Rapports
week|Weekly|Icyumweru|Wiki|Hebdo
month|Monthly|Ukwezi|Mwezi|Mensuel
year|Yearly|Umwaka|Mwaka|Annuel
mem|Members|Abanyamuryango|Wanachama|Membres
add|Add member|Ongeraho umunyamuryango|Ongeza mwanachama|Ajouter un membre
save|Save|Bika|Hifadhi|Enregistrer
del|Delete|Siba|Futa|Supprimer
cash|Cash payment|Ubwishyu mu ntoki|Malipo ya pesa taslimu|Paiement en espèces
search|Search...|Shakisha...|Tafuta...|Rechercher...
ok|Saved!|Byakozwe!|Imehifadhiwa!|Enregistré !
bad|Wrong details|Amakuru siyo|Taarifa si sahihi|Informations incorrectes
all|All churches|Amatorero yose|Makanisa yote|Toutes les églises
top|Top givers|Abatanze cyane|Watoaji wakuu|Meilleurs donateurs
pw|Your password will be 123|Ijambobanga ryawe ni 123|Nenosiri lako ni 123|Votre mot de passe sera 123
by|Received by|Cyakiriwe na|Imepokelewa na|Reçu par
mbr|Member|Umunyamuryango|Mwanachama|Membre
who|Choose how to log in|Hitamo uko winjira|Chagua jinsi ya kuingia|Choisissez votre connexion
rm|Member|Umunyamuryango|Mwanachama|Membre
rl|Church leader|Umuyobozi w'itorero|Kiongozi wa kanisa|Responsable d'église
ra|Admin|Umuyobozi mukuru|Msimamizi|Administrateur
back|Back|Garuka|Rudi|Retour
full|Full report|Raporo yuzuye|Ripoti kamili|Rapport complet
bymeth|By payment method|Ukurikije uburyo bwo kwishyura|Kwa njia ya malipo|Par mode de paiement
bych|By church|Ukurikije itorero|Kwa kanisa|Par église
bymem|By member|Ukurikije umunyamuryango|Kwa mwanachama|Par membre
alltx|All payments|Ubwishyu bwose|Malipo yote|Tous les paiements
ana|Analytics|Isesengura|Uchambuzi|Analyses
mon|This month|Uku kwezi|Mwezi huu|Ce mois-ci
grow|vs last month|ugereranyije n'ukwezi gushize|dhidi ya mwezi uliopita|par rapport au mois dernier
act|Active givers|Abatanze|Watoaji hai|Donateurs actifs
trend|Last 12 months|Amezi 12 ashize|Miezi 12 iliyopita|12 derniers mois
rank|Churches ranking (this year)|Urutonde rw'amatorero (uyu mwaka)|Orodha ya makanisa (mwaka huu)|Classement des églises (cette année)
share|Payment methods (this year)|Uburyo bwo kwishyura (uyu mwaka)|Njia za malipo (mwaka huu)|Modes de paiement (cette année)
late|No payment in 60 days|Nta bwishyu mu minsi 60|Bila malipo siku 60|Sans paiement depuis 60 jours
avgm|Average per member|Impuzandengo ku munyamuryango|Wastani kwa mwanachama|Moyenne par membre
part|Participation|Uruhare|Ushiriki|Participation
exist|Already exists|Isanzweho|Tayari ipo|Existe déjà`.split('\n').forEach(l=>{const a=l.split('|');TR[a[0]]={en:a[1],rw:a[2],sw:a[3],fr:a[4]}});
