package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	model "../model"
)

// ArtistHandle ...
func ArtistHandle(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/artist" {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
	param := r.URL.Query().Get("id")
	id, err := strconv.Atoi(param)
	if err != nil {
		http.Error(w, "Noup ne prokanayet", http.StatusBadRequest)
		return
	}
	if id < 1 || id > 52 {
		http.Error(w, "Oopss ... not Found", http.StatusNotFound)
		return
	}
	resp, err := http.Get(api + artistPart + "/" + strconv.Itoa(id))
	if err != nil {
		fmt.Println(err.Error())
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()
	artistData := &model.Artist{}
	err = json.NewDecoder(resp.Body).Decode(&artistData)
	if err != nil {
		fmt.Println(err.Error())
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}
	relation, err := GetRelation(artistData.RelationURL)
	if err != nil {
		fmt.Println(err.Error())
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		return
	}
	artistData.Relations = relation
	tpl.ExecuteTemplate(w, "artist.html", artistData)
}
