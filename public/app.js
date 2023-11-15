new Vue({
    el: '#app',
    data: {
      title: 'Pilot Logbook',
      flights: [],
      newFlight: {
        pilot_name: '',
        // Add more properties as needed
      },
    },
    methods: {
      async fetchFlights() {
        try {
          const response = await fetch('/flights');
          const data = await response.json();
          this.flights = data;
        } catch (error) {
          console.error('Error fetching flights:', error);
        }
      },
      async addFlight() {
        try {
          const response = await fetch('/add-flight', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.newFlight),
          });
          const result = await response.json();
          if (result.success) {
            this.fetchFlights(); // Refresh the list after adding a new flight
            this.newFlight = {}; // Reset the form
          }
        } catch (error) {
          console.error('Error adding flight:', error);
        }
      },
    },
    mounted() {
      this.fetchFlights(); // Fetch flights when the component is mounted
    },
  });
  