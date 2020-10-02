package controller

import "net/http"

// SearchHandler ...
func SearchHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/search" {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}

	tpl.ExecuteTemplate(w, "search.html", nil)

}
