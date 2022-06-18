import { useEffect, useState } from 'react';
import PersonnelSelected from '../../../component/widgets/formComponents/personnelSelected';

const Personnel = (props: any) => {
    let id, ids: any[];
    if(props.id) {
        id = props.id.replace('_', ',');
        ids = id.split(',');
    }
    const [participatorData, setParticipatorData] = useState([])

    useEffect(() => {
        const dataObj: any = {};
        if(participatorData.length){
            ids.forEach((item: any) => {
                if(item !== 'ApprovalFormOwner_show' && item !== 'PotentialOwner_show'){
                    dataObj[item] = participatorData.map((item: any) => item.Userid).join(',')
                } else if(item === 'ApprovalFormOwner_show' || item === 'PotentialOwner_show'){
                    dataObj[item] = participatorData.map((item: any) => item.CnName).join(',')
                }
            })
        }
        props.onChange?.(dataObj)
    }, [participatorData])
    return (
        <div className="personnel-form">
            <div style={{marginRight: 10}}>{participatorData.map((item: any) => item.CnName).join(',')}</div>
            <PersonnelSelected save={setParticipatorData} />
        </div>
    )
}

export default Personnel