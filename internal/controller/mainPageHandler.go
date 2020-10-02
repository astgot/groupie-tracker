package controller

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"

	model "../model"
)

const (
	api        = "https://groupietrackers.herokuapp.com/api"
	artistPart = "/artists"
)

var tpl = template.Must(template.ParseGlob("web/templates/*"))

// MainHandle ...
func MainHandle(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" && r.URL.Path != "/artists" {
		http.Error(w, "404 Not Found", http.StatusNotFound)
		return
	}
	resp, err := http.Get(api + artistPart)
	if err != nil {
		fmt.Println(err.Error())
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()
	artists := model.Artists{}

	err = json.NewDecoder(resp.Body).Decode(&artists)
	if err != nil {
		fmt.Println(err.Error())
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}
	tpl.ExecuteTemplate(w, "index.html", artists)
}
