# streamOnline-recruitment

Moduł składa się z dwóch funkcji:

1.oneTimeRun - do wykonania funkcji o określonej porze.<br>
oneTimeRun(usersFunction, date)<br>
usersFunction - jest to funkcja lub metoda funkcji którą chcemy wykonać<br>
date - jest to data w formatach:<br>
a - standard ISO 8601, czyli "YYYY-MM-DDTHH:mm:ss.sssZ", gdzie:<br>
YYYY: Rok (np. 2022)<br>
MM: Miesiąc (01 do 12)<br>
DD: Dzień (01 do 31)<br>
HH: Godzina (00 do 23)<br>
mm: Minuty (00 do 59)<br>
ss: Sekundy (00 do 59)<br>
sss: Milisekundy (opcjonalne)<br>
np.: "2022-01-01T12:00:00Z"<br>
b - liczbę reprezentującą liczbę milisekund, która upłynęła od 1 stycznia 1970 r. UTC (epoch time)<br>
np.: 1640995200000 - Dla 1 stycznia 2022 r.<br>
2.createIntervalCron - funkcja do wykonywania funkcji o określonych porach / co dany interwał czasu.<br>
createIntervalCron(usersFunction, cronExpression)<br>
usersFunction - jest to funkcja lub metoda funkcji którą chcemy wykonać<br>
cronExpression - jest to polecenie w formacie '\* \* \* \* \* \*';<br>
Każda z gwiazdek oznacza konkretny typ jednostki czasu, licząc od lewej:<br>
pierwsza gwiazdka - sekundy -<br>
możemy wstawić "\*" co daje nam wykonywanie w każdej sekundzie,<br>
możemy wstawić format "\*/3" co daje nam wykonywanie co 3 sekundy - generalny format "\*/x" gdzie x > 0 i będzie to wykonywanie co x sekund,<br>
możemy wstawić format "3-10" co daje nam wykonywanie od 3 do 10 sekundy włacznie, czyli dla np godziny 19:45 wykona się skrypt o godzinach 19:45:03 - 19:45:10<br>
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie o konkretnych sekundach, czyli dla np godziny 19:45 wykona się skrypt o godzinach 19:45:02 i 19:45:04<br>
<br>
druga gwiazdka - minuty -<br>
możemy wstawić "\*" co daje nam wykonywanie w każdej minucie,<br>
możemy wstawić format "\*/3" co daje nam wykonywanie co 3 minuty - generalny format "\*/x" gdzie x > 0 i będzie to wykonywanie co x minut,<br>
możemy wstawić format "3-10" co daje nam wykonywanie od 3 do 10 minuty włacznie, czyli dla np godziny 19 wykona się skrypt o godzinach 19:03 - 19:10<br>
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie o konkretnych minutach, czyli dla np godziny 19 wykona się skrypt o godzinach 19:02 i 19:04, przez cały okres trwania konkretnych minut<br>

trzecia gwiazdka - godziny -<br>
możemy wstawić "\*" co daje nam wykonywanie w każdej godzinie,<br>
możemy wstawić format "\*/3" co daje nam wykonywanie co 3 godziny - generalny format "\*/x" gdzie x > 0 i będzie to wykonywanie co x godzin,<br>
możemy wstawić format "3-10" co daje nam wykonywanie od 3 do 10 godziny włacznie, czyli np skrypt wykoną się od 03:00 do 10:00, przez cały okres trwania<br>
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie o konkretnych godzinach, czyli np skrypt wykoną się od 03:00 do 10:00 przez cały okres trwania konkretnych godzin<br>

czwarta gwiazdka - konkretny dzień miesiąca -<br>
możemy wstawić "\*" co daje nam wykonywanie w każdym dniu miesiąca,<br>
możemy wstawić format "\*/3" co daje nam wykonywanie co 3 dni - generalny format "\*/x" gdzie x > 0 i będzie to wykonywanie co x dni,<br>
możemy wstawić format "3-10" co daje nam wykonywanie od 3 do 10 dnia włacznie, czyli np skrypt wykoną się od 3 do 10 dnia, przez cały okres trwania<br>
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie w konkretnych dniach, czyli np skrypt wykoną się 3 dnia miesiąca i 10 dnia miesiąca<br>

piąta gwiazdka - konkretny dzień tygodnia -<br>
możemy wstawić "\*" co daje nam wykonywanie w każdym dniu tygodnia,<br>
możemy wstawić format "\*/3" co daje nam wykonywanie co 3 tygodnie - generalny format "\*/x" gdzie x > 0 i będzie to wykonywanie co x dni,<br>
możemy wstawić format "2-4" co daje nam wykonywanie od wtorku do czwartku, liczymy od poniedziałku(1) do niedzieli(7) po kolei dni<br>
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie w konkretnych dniach tygodnia, czyli np skrypt wykoną się tylko we wtorki i w czwartki<br>

szósta gwiazdka - konkretny miesiąc -<br>
możemy wstawić "\*" co daje nam wykonywanie w każdym miesiącu,<br>
możemy wstawić format "2-4" co daje nam wykonywanie od lutego do kwietnia, liczymy od stycznia(1) do grudnia(7) po kolei miesiące<br>
możemy wstawić konkretne liczby oddzielone przecinkiem "2,4", co daje nam wykonanie w konkretnych miesiącach, czyli np skrypt wykoną się tylko przez cały luty i caly kwiecień<br>

PRZYKŁADY:<br>
wykonywanie co sekunde: (\* \* \* \* \* \*)<br>
wykonywanie co sekunde w piątki w lutym (\* \* \* \* 5 2)<br>
wykonywanie co 3 sekundy w środy (\*/3 \* \* \* 3 \*)<br>

przykład w kodzie:<br>
const job1 = () => console.log("job executed");<br>
const stopJob = createIntervalCron(job1, cron);<br>
<br>
WAZNE:<br>
Po wywołaniu funkcji createIntervalCron, zwraca nam ona funkcję, którą możemy wykonać aby zatrzymać dany CRON, w powyzszym przypadku wywołałi byśmy funkcję stopJob();<br>
