import {useState, useEffect} from 'react'
import {Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios'

const Contents = () => {

    const [confirmedData, setConfirmedData] = useState({})
    const [quarantinedData, setquarantinedData] = useState({})
    const [comparedData, setcomparedData] = useState({})

    /*class 실행시 자동 실행*/
    useEffect(()=>{
        const fetchEvents = async ()=>{
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr")
            /*await : axios.get이 다 끝난 후 다음 라인이 실행되도록 */
            //console.log(res)
            makeData(res.data)
        }
        /*넘어온 값을 items에 넣고 사용할 수 있게끔 */
        const makeData = (items)=>{
            //items.forEach(item=>console.log(item))
            //reduce : map filter (필요한 값만 필터링)
            const arr = items.reduce((acc, cur)=>{
                //날짜만 가져옴
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                //console.log(year, month, date)

                //각 달의 마지막 날 값만 가져옴
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const death = cur.Deaths;
                const recovered = cur.Recovered;
                //누적되는 acc에 없으면 push, 있으면 넘어감
                const findItem = acc.find(a=>a.year === year && a.month === month); //findItem값이 바뀌면 acc 값도 바뀜
                if(!findItem){
                    acc.push({year, month, date, confirmed, active, death, recovered})
                }
                if(findItem && findItem.date < date) /*현재 날짜보다 이전이면 udate*/{
                    findItem.active = active;
                    findItem.death = death;
                    findItem.date = date;
                    findItem.year = year;
                    findItem.month = month;
                    findItem.recovered = recovered;
                    findItem.confirmed = confirmed;
                }
                return acc;
            },[])
            //console.log(arr);

            //map : 배열 재정의
            const labels = arr.map(a=> '${a.month+1} 월' );
            setConfirmedData({
                labels,  //labels = labels, 이렇게 같은 땐 축약 가능
                datasets:[
                {
                label:"특이 리뷰 갯수",
                backgroundColor:"salmon",
                fill:true,
                /*여기에 실제 값 입력*/
                data:arr.map(a=>a.confirmed)
            },
         ]
            });
            setquarantinedData({
                labels,  //labels = labels, 이렇게 같은 땐 축약 가능
                datasets:[
                {
                label:"분석 Chart/Graph",
                borderColor:"skyblue",
                fill:false,
                /*여기에 실제 값 입력*/
                data:arr.map(a=>a.active)
            },
         ]
            });
            const last = arr[arr.length-1]
            setcomparedData({
                labels:["치료","서비스","시설"],  //labels = labels, 이렇게 같은 땐 축약 가능
                datasets:[
                {
                label:"마케팅 분석 결과(${new Date().getMonth()+1}월)",
                backgroundColor:["#ff3d67", "#059bff","#ffc233"],
                borderColor:["#ff3d67", "#059bff","#ffc233"],
                fill:false,
                /*여기에 실제 값 입력*/
                data:[last.confirmed, last.recovered, last.death]
            },
         ]
            });
        }
        /*call */
        fetchEvents();
    }, [])

    return (
        /*더 많은 그래프 option은 chart.js 공식 홈페이지 */
        <section>
        <h2>특이 사항 / 위기</h2>
        <div className="contents">
            <div> 
                <Bar data={confirmedData} options={
                    { title: { display:true, text:"특이사항 리뷰 갯수", fontSize:16 },
                     legend: { display:true, position:"bottom"}}
                } />
            </div>
            <div> 
                <Line data={quarantinedData} options={
                    { title: { display:true, text:"분석 Chart/Graph", fontSize:16 },
                     legend: { display:true, position:"bottom"}}
                } />
            </div>
            <div> 
                <Doughnut data={comparedData} options={
                    { title: { display:true, text:"마케팅 분석 결과(${new Date().getMonth()+1}월)", fontSize:16 },
                     legend: { display:true, position:"bottom"}}
                } />
            </div>
        </div>
      </section>
    )
}

export default Contents
