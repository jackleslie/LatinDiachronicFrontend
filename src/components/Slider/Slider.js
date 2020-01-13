import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Slider from "@material-ui/core/Slider"
import { yearLabel } from "../../utils"

const useStyles = makeStyles({
  root: {
    width: "100%",
    paddingLeft: "0.5rem",
    paddingRight: "0.5rem",
    color: "rgb(49, 130, 206)",
  },
  rail: {
    backgroundColor: "rgb(226, 232, 240)",
    height: "4px",
    borderRadius: "0.125rem",
  },
  track: {
    backgroundColor: "rgb(49, 130, 206)",
    height: "4px",
    borderRadius: "0.125rem",
  },
  thumb: {
    width: "14px",
    height: "14px",
    backgroundColor: "rgb(255, 255, 255)",
    boxShadow:
      "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
    "&:hover, &:active": {
      boxShadow:
        "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
    },
    "&:focus": {
      boxShadow: "rgba(66, 153, 225, 0.6) 0px 0px 0px 3px",
    },
  },
  valueLabel: {
    color: "rgb(49, 130, 206)",
    fontFamily: "inherit",
    fontSize: "0.6rem",
  },
  mark: {
    width: "2px",
    height: "2px",
    borderRadius: "2px",
    marginTop: "1px",
    color: "rgb(49, 130, 206)",
    display: "none",
  },
})

const marks = [
  {
    value: -500,
  },
  {
    value: -400,
  },
  {
    value: -300,
  },
  {
    value: -200,
  },
  {
    value: -100,
  },
  {
    value: 100,
  },
  {
    value: 200,
  },
  {
    value: 300,
  },
  {
    value: 400,
  },
  {
    value: 500,
  },
  {
    value: 600,
  },
]

export default function RangeSlider({ value, setValue }) {
  const { root, rail, track, thumb, valueLabel, mark } = useStyles()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <div className={root}>
      <Slider
        classes={{
          rail,
          track,
          thumb,
          valueLabel,
          mark,
        }}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="off"
        aria-labelledby="range-slider"
        getAriaValueText={yearLabel}
        marks={marks}
        step={null}
        min={-500}
        max={600}
        valueLabelFormat={yearLabel}
      />
    </div>
  )
}
