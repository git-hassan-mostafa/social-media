'use client'
import CircularProgress from '@mui/material/CircularProgress'

const ProgressCircule = () => {
    return (
        <div className='progress-circule'>
            <CircularProgress className='progress-circule-icon' />
        </div>
    )
}

export const ProgressCirculeInline = () => {
    return (
        <CircularProgress className='progress-circule-icon' style={{
            display: 'block',
            margin: '10px auto'
        }} />
    )
}

export default ProgressCircule
