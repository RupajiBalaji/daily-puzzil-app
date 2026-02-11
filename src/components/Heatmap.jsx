function Heatmap() {

    const history = JSON.parse(localStorage.getItem("puzzleHistory")) || {}
  
    const generateLast30Days = () => {
      const days = []
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        days.push(date.toISOString().split("T")[0])
      }
      return days
    }
  
    const days = generateLast30Days()
  
    return (
      <div className="mt-8">
        <h3 className="text-xl mb-3">Last 30 Days Activity</h3>
  
        <div className="grid grid-cols-10 gap-2">
          {days.map((day) => (
            <div
              key={day}
              className={`w-6 h-6 rounded ${
                history[day] ? "bg-green-500" : "bg-gray-700"
              }`}
              title={day}
            ></div>
          ))}
        </div>
      </div>
    )
  }
  
  export default Heatmap
  