# streamOnline-recruitment

Moduł składa się z dwóch funkcji:

1.oneTimeRun - do wykonania funkcji o określonej porze.
oneTimeRun(usersFunction, date)
usersFunction - jest to funkcja lub metoda funkcji którą chcemy wykonać
date - jest to data w formatach:
a - standard ISO 8601, czyli "YYYY-MM-DDTHH:mm:ss.sssZ", gdzie:
YYYY: Rok (np. 2022)
MM: Miesiąc (01 do 12)
DD: Dzień (01 do 31)
HH: Godzina (00 do 23)
mm: Minuty (00 do 59)
ss: Sekundy (00 do 59)
sss: Milisekundy (opcjonalne)
np.: "2022-01-01T12:00:00Z"
b - liczbę reprezentującą liczbę milisekund, która upłynęła od 1 stycznia 1970 r. UTC (epoch time)
np.: 1640995200000 - Dla 1 stycznia 2022 r.
2.createIntervalCron - funkcja do wykonywania funkcji o określonych porach / co dany interwał czasu.
createIntervalCron(usersFunction, cronExpression)
usersFunction - jest to funkcja lub metoda funkcji którą chcemy wykonać
cronExpression - jest to polecenie w formacie '\* \* \* \* \* \*';
Każda z gwiazdek oznacza konkretny typ jednostki czasu, licząc od lewej:
pierwsza gwiazdka - sekundy -
możemy wstawić "\*" co daje nam wykonywanie w każdej sekundzie,
możemy wstawić format "\*/3" co daje nam wykonywanie co 3 sekundy - generalny format "\*/x" gdzie x > 0 i będzie to wykonywanie co x sekund,
możemy wstawić format "3-10" co daje nam wykonywanie od 3 do 10 sekundy włacznie, czyli dla np godziny 19:45 wykona się skrypt o godzinach 19:45:03 - 19:45:10
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie o konkretnych sekundach, czyli dla np godziny 19:45 wykona się skrypt o godzinach 19:45:02 i 19:45:04
druga gwiazdka - minuty -
możemy wstawić "\*" co daje nam wykonywanie w każdej minucie,
możemy wstawić format "\*/3" co daje nam wykonywanie co 3 minuty - generalny format "\*/x" gdzie x > 0 i będzie to wykonywanie co x minut,
możemy wstawić format "3-10" co daje nam wykonywanie od 3 do 10 minuty włacznie, czyli dla np godziny 19 wykona się skrypt o godzinach 19:03 - 19:10
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie o konkretnych minutach, czyli dla np godziny 19 wykona się skrypt o godzinach 19:02 i 19:04, przez cały okres trwania konkretnych minut
trzecia gwiazdka - godziny -
możemy wstawić "\*" co daje nam wykonywanie w każdej godzinie,
możemy wstawić format "\*/3" co daje nam wykonywanie co 3 godziny - generalny format "\*/x" gdzie x > 0 i będzie to wykonywanie co x godzin,
możemy wstawić format "3-10" co daje nam wykonywanie od 3 do 10 godziny włacznie, czyli np skrypt wykoną się od 03:00 do 10:00, przez cały okres trwania
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie o konkretnych godzinach, czyli np skrypt wykoną się od 03:00 do 10:00 przez cały okres trwania konkretnych godzin
czwarta gwiazdka - konkretny dzień miesiąca -
możemy wstawić "\*" co daje nam wykonywanie w każdym dniu miesiąca,
możemy wstawić format "\*/3" co daje nam wykonywanie co 3 dni - generalny format "\*/x" gdzie x > 0 i będzie to wykonywanie co x dni,
możemy wstawić format "3-10" co daje nam wykonywanie od 3 do 10 dnia włacznie, czyli np skrypt wykoną się od 3 do 10 dnia, przez cały okres trwania
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie w konkretnych dniach, czyli np skrypt wykoną się 3 dnia miesiąca i 10 dnia miesiąca
piąta gwiazdka - konkretny dzień tygodnia -
możemy wstawić "\*" co daje nam wykonywanie w każdym dniu tygodnia,
możemy wstawić format "\*/3" co daje nam wykonywanie co 3 tygodnie - generalny format "\*/x" gdzie x > 0 i będzie to wykonywanie co x dni,
możemy wstawić format "2-4" co daje nam wykonywanie od wtorku do czwartku, liczymy od poniedziałku(1) do niedzieli(7) po kolei dni
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie w konkretnych dniach tygodnia, czyli np skrypt wykoną się tylko we wtorki i w czwartki
szósta gwiazdka - konkretny miesiąc -
możemy wstawić "\*" co daje nam wykonywanie w każdym miesiącu,
możemy wstawić format "2-4" co daje nam wykonywanie od lutego do kwietnia, liczymy od stycznia(1) do grudnia(7) po kolei miesiące
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie w konkretnych miesiącach, czyli np skrypt wykoną się tylko przez cały luty i caly kwiecień

PRZYKŁADY:
wykonywanie co sekunde: (\* \* \* \* \* \*)
wykonywanie co sekunde w piątki w lutym (\* \* \* \* 5 2)
wykonywanie co 3 sekundy w środy (\*/3 \* \* \* 3 \*)

przykład w kodzie:
const job1 = () => console.log("job executed");
const stopJob = createIntervalCron(job1, cron);

WAZNE:
Po wywołaniu funkcji createIntervalCron, zwraca nam ona funkcję, którą możemy wykonać aby zatrzymać dany CRON, w powyzszym przypadku wywołałi byśmy funkcję stopJob();
